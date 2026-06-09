import { useState, useEffect, useRef } from "react";
import { X, Send, Trash2, Edit2, Check, CornerUpLeft } from "lucide-react";
import { db } from "../firebase";
import {
  collection, addDoc, doc, onSnapshot, serverTimestamp,
  query, orderBy, updateDoc, getDocs, getDoc, deleteDoc, where, limit
} from "firebase/firestore";

const MAX_CHARS = 500;

function UserAvatar({ name, bgColor, size = "sm" }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const sizeClass = size === "md" ? "w-10 h-10 text-lg" : "w-8 h-8 text-sm";
  const bg = bgColor || "var(--pastel-blue)";
  return (
    <div
      className={`${sizeClass} border-2 border-black rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]`}
      style={{ backgroundColor: bg }}
    >
      <span className="font-black text-gray-700">{initial}</span>
    </div>
  );
}

export default function ChatModal({ otherUser, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [sending, setSending] = useState(false);
  const [otherUserData, setOtherUserData] = useState(otherUser || null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  // Reply state
  const [replyTo, setReplyTo] = useState(null); // { id, text, senderName }
  // Edit state
  const [editingMsg, setEditingMsg] = useState(null); // { id, text }
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync otherUserData from prop
  useEffect(() => {
    if (otherUser) setOtherUserData(otherUser);
  }, [otherUser]);

  // Find or create conversation
  useEffect(() => {
    if (!currentUser?.uid || !otherUserData?.id) return;
    const initConversation = async () => {
      const participants = [currentUser.uid, otherUserData.id].sort();
      const q = query(
        collection(db, "conversations"),
        where("participants", "==", participants),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setConversationId(snap.docs[0].id);
      } else {
        const participantsData = {
          [currentUser.uid]: {
            name: currentUser.name || currentUser.displayName || "Pengguna",
            avatarColor: currentUser.avatarColor || "var(--pastel-blue)",
          },
          [otherUserData.id]: {
            name: otherUserData.name || otherUserData.displayName || "Pengguna",
            avatarColor: otherUserData.avatarColor || "var(--pastel-blue)",
          },
        };
        const convRef = await addDoc(collection(db, "conversations"), {
          participants,
          participantsData,
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
          lastMessageBy: "",
          unreadCount: { [currentUser.uid]: 0, [otherUserData.id]: 0 },
          createdAt: serverTimestamp(),
        });
        setConversationId(convRef.id);
      }
    };
    initConversation();
  }, [currentUser, otherUserData]);

  // Listen to messages
  useEffect(() => {
    if (!conversationId) return;
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [conversationId]);

  // Reset unread count (hapus notif) saat chat dibuka
  useEffect(() => {
    if (!conversationId || !currentUser?.uid) return;
    updateDoc(doc(db, "conversations", conversationId), {
      [`unreadCount.${currentUser.uid}`]: 0,
    });
  }, [conversationId, currentUser]);

  // ── Send / Edit ───────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId || sending) return;

    // EDIT MODE
    if (editingMsg) {
      setSending(true);
      try {
        await updateDoc(
          doc(db, "conversations", conversationId, "messages", editingMsg.id),
          { text: text.trim(), edited: true, editedAt: serverTimestamp() }
        );
        setEditingMsg(null);
        setText("");
      } catch (err) {
        console.error("Gagal edit pesan:", err);
      } finally {
        setSending(false);
      }
      return;
    }

    // SEND MODE
    setSending(true);
    try {
      const msgData = {
        senderId: currentUser.uid,
        senderName: currentUser.name || currentUser.displayName || "Pengguna",
        text: text.trim(),
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid],
      };
      if (replyTo) {
        msgData.replyTo = {
          id: replyTo.id,
          text: replyTo.text,
          senderName: replyTo.senderName,
        };
      }
      await addDoc(collection(db, "conversations", conversationId, "messages"), msgData);

      const convRef = doc(db, "conversations", conversationId);
      const otherId = otherUserData?.id;
      const convSnap = await getDoc(convRef);
      const currentOtherUnread = convSnap.data()?.unreadCount?.[otherId] || 0;
      await updateDoc(convRef, {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
        lastMessageBy: currentUser.uid,
        [`unreadCount.${otherId}`]: currentOtherUnread + 1,
      });
      setText("");
      setReplyTo(null);
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    } finally {
      setSending(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (msg) => {
    if (!window.confirm("Hapus pesan ini?")) return;
    try {
      await deleteDoc(doc(db, "conversations", conversationId, "messages", msg.id));
      // If last message, clear lastMessage in conversation
      const convRef = doc(db, "conversations", conversationId);
      const convSnap = await getDoc(convRef);
      if (convSnap.data()?.lastMessage === msg.text && convSnap.data()?.lastMessageBy === currentUser.uid) {
        await updateDoc(convRef, { lastMessage: "[Pesan dihapus]" });
      }
    } catch (err) {
      console.error("Gagal hapus pesan:", err);
    }
  };

  // ── Edit / Reply helpers ──────────────────────────────────────────
  const startEdit = (msg) => {
    setEditingMsg(msg);
    setReplyTo(null);
    setText(msg.text);
    inputRef.current?.focus();
  };

  const cancelEdit = () => {
    setEditingMsg(null);
    setText("");
  };

  const startReply = (msg) => {
    setReplyTo({ id: msg.id, text: msg.text, senderName: msg.senderName });
    setEditingMsg(null);
    setText("");
    inputRef.current?.focus();
  };

  if (!otherUserData) return null;

  const displayName = otherUserData.name || otherUserData.displayName || "Pengguna";
  const charsUsed = text.length;
  const charsLeft = MAX_CHARS - charsUsed;
  const charsWarning = charsLeft < 80;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 modal-overlay">
      <div className="comic-box bg-white w-full sm:max-w-md max-h-[90vh] h-full sm:h-auto flex flex-col animate-bounce-in">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="bg-[var(--shinchan-yellow)] p-3 border-b-3 border-black flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <UserAvatar name={displayName} bgColor={otherUserData.avatarColor} size="sm" />
            <div>
              <h3 className="text-sm font-extrabold leading-tight">{displayName}</h3>
              <p className="text-[10px] font-bold text-gray-600">Pesan Pribadi</p>
            </div>
          </div>
          <button onClick={onClose} className="comic-btn p-1.5 rounded-lg bg-white">
            <X size={16} />
          </button>
        </div>

        {/* ── Messages ─────────────────────────────────────────────── */}
        <div
          className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50/50"
          style={{ minHeight: 0 }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-xs font-bold text-gray-400">
                Belum ada pesan. Kirim sapaan pertama!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser?.uid;
              const isHovered = hoveredMsg === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"} group`}
                  onMouseEnter={() => setHoveredMsg(msg.id)}
                  onMouseLeave={() => setHoveredMsg(null)}
                >
                  {/* Reply preview */}
                  {msg.replyTo && (
                    <div
                      className={`text-[9px] font-bold px-2 py-1 mb-0.5 rounded-lg border border-black/20 bg-black/5 max-w-[80%] ${
                        isMine ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-gray-500">↩ {msg.replyTo.senderName}: </span>
                      <span className="text-gray-600 line-clamp-1">{msg.replyTo.text}</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] px-3 py-2 border-2 border-black rounded-xl shadow-[1px_1px_0px_#000] break-words ${
                      isMine ? "bg-[var(--shinchan-yellow)]" : "bg-white"
                    }`}
                  >
                    <p className="text-xs font-medium leading-snug">{msg.text || ""}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {msg.edited && (
                        <span className="text-[8px] text-gray-400 italic">diedit</span>
                      )}
                      <p className="text-[9px] text-gray-400 font-bold">
                        {msg.createdAt?.toDate
                          ? msg.createdAt
                              .toDate()
                              .toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons (on hover) */}
                  <div
                    className={`flex gap-1 mt-1 transition-opacity duration-150 ${
                      isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <button
                      onClick={() => startReply(msg)}
                      className="flex items-center gap-0.5 text-[9px] font-bold bg-white border-2 border-black rounded-md px-1.5 py-0.5 hover:bg-gray-100 shadow-[1px_1px_0px_#000]"
                      title="Balas"
                    >
                      <CornerUpLeft size={9} /> Balas
                    </button>
                    {isMine && (
                      <>
                        <button
                          onClick={() => startEdit(msg)}
                          className="flex items-center gap-0.5 text-[9px] font-bold bg-white border-2 border-black rounded-md px-1.5 py-0.5 hover:bg-blue-50 text-blue-700 shadow-[1px_1px_0px_#000]"
                          title="Edit"
                        >
                          <Edit2 size={9} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(msg)}
                          className="flex items-center gap-0.5 text-[9px] font-bold bg-white border-2 border-black rounded-md px-1.5 py-0.5 hover:bg-red-50 text-red-600 shadow-[1px_1px_0px_#000]"
                          title="Hapus"
                        >
                          <Trash2 size={9} /> Hapus
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Reply Preview Bar ─────────────────────────────────────── */}
        {replyTo && (
          <div className="px-3 py-2 border-t-2 border-black bg-yellow-50 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <CornerUpLeft size={12} className="text-[var(--shinchan-red)] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold text-gray-600">{replyTo.senderName}</p>
                <p className="text-[10px] font-medium text-gray-700 truncate">{replyTo.text}</p>
              </div>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Edit Mode Bar ─────────────────────────────────────────── */}
        {editingMsg && (
          <div className="px-3 py-2 border-t-2 border-black bg-blue-50 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Edit2 size={12} className="text-blue-500 flex-shrink-0" />
              <p className="text-[10px] font-bold text-blue-700 truncate">
                Mengedit pesan...
              </p>
            </div>
            <button
              onClick={cancelEdit}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Input ────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t-3 border-black flex flex-col gap-1 flex-shrink-0 bg-white"
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={editingMsg ? "Edit pesan..." : "Ketik pesan..."}
              className="comic-input text-sm flex-grow"
              maxLength={MAX_CHARS}
              required
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="comic-btn bg-[var(--shinchan-yellow)] text-xs font-bold flex-shrink-0 px-3"
              title={editingMsg ? "Simpan edit" : "Kirim"}
            >
              {editingMsg ? <Check size={14} /> : <Send size={14} />}
            </button>
          </div>
          {/* Character counter */}
          {charsUsed > 0 && (
            <p
              className={`text-[9px] font-bold text-right transition-colors ${
                charsWarning ? "text-red-500" : "text-gray-400"
              }`}
            >
              {charsUsed}/{MAX_CHARS}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}