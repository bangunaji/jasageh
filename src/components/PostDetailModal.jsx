import React, { useState, useEffect } from "react";
import { X, Send, Trash2, MessageSquare, MapPin, Tag, Calendar, CornerDownRight } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, increment } from "firebase/firestore";

// ─── 1. FUNGSI PENOLONG HIGHLIGHT MENTION ───
// Berfungsi merubah teks @nama menjadi warna biru tebal bergaya komik
const renderCommentText = (text) => {
  if (!text) return "";

  // Regex untuk mendeteksi kata yang diawali dengan @
  const mentionRegex = /(@[a-zA-Z0-9_\s.]+)/g;
  const parts = text.split(mentionRegex);

  return parts.map((part, index) => {
    if (part.match(mentionRegex)) {
      return (
        <span key={index} className="text-blue-600 font-black bg-blue-50 px-1 py-0.5 rounded border border-blue-200 inline-block text-[11px]">
          {part}
        </span>
      );
    }
    return part;
  });
};

function UserAvatar({ name, bgColor, size = "sm" }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const sizeClass = size === "md" ? "w-12 h-12 text-xl" : "w-8 h-8 text-sm";
  const bg = bgColor || "var(--pastel-blue)";
  return (
    <div className={`${sizeClass} border-2 border-black rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]`} style={{ backgroundColor: bg }}>
      <span className="font-black text-gray-700">{initial}</span>
    </div>
  );
}

export default function PostDetailModal({ post, currentUser, onClose, onOpenUserProfile, onOpenChat }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const collectionName = post?.whatsapp || post?.region ? "posts" : "mading";

  // Fetch comments real-time
  useEffect(() => {
    if (!post?.id) return;
    const q = query(collection(db, collectionName, post.id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(list);
    });
    return () => unsubscribe();
  }, [post?.id, collectionName]);

  // Handle send comment / reply (Menggunakan Nama Unik Baru)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    setLoading(true);
    try {
      const commentData = {
        userId: currentUser.uid,
        // Menggunakan nama unik dari Firestore, fallback ke displayName Google jika kosong
        userName: currentUser.name || currentUser.displayName || "Anonim",
        userAvatarColor: currentUser.avatarColor || "var(--pastel-blue)",
        text: commentText.trim(),
        createdAt: serverTimestamp(),
        parentId: replyTo ? replyTo.mainCommentId : null,
        replyToCommentId: replyTo ? replyTo.id : null,
        // Target balasan langsung mengacu ke nama unik polosan
        replyToUserName: replyTo ? replyTo.userName : null
      };

      await addDoc(collection(db, collectionName, post.id, "comments"), commentData);
      await updateDoc(doc(db, collectionName, post.id), {
        commentCount: increment(1)
      });
      setCommentText("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete comment / reply
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Hapus komentar ini?")) return;
    try {
      await deleteDoc(doc(db, collectionName, post.id, "comments", commentId));
      await updateDoc(doc(db, collectionName, post.id), {
        commentCount: increment(-1)
      });
      if (replyTo && replyTo.id === commentId) {
        setReplyTo(null);
      }
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "";

  const mainComments = comments.filter(c => !c.parentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="comic-box bg-white w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">

        {/* Header Modal */}
        <div className="bg-[var(--shinchan-yellow)] border-b-3 border-black p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onOpenUserProfile(post.userId)}>
            <UserAvatar name={post.userName} bgColor={post.userAvatarColor} size="md" />
            <div>
              <h3 className="text-sm font-black hover:underline">{post.userName}</h3>
              <p className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5 mt-0.5">
                <MapPin size={10} />{post.region || "Mading Papan Pengumuman"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="bg-white border-2 border-black p-1.5 rounded-lg shadow-[1px_1px_0px_#000] hover:bg-red-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body Modal Scrollable */}
        <div className="p-5 flex-grow overflow-y-auto space-y-5">
          {/* Post Content */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.type && (
                <span className={`comic-tag text-[9px] ${post.type === "offer" ? "bg-[var(--shinchan-yellow)]  text-black-900 border-black-900" : "bg-[var(--shinchan-yellow)]  text-black-900 border-black-900"}`}>
                  {post.type === "offer" ? "🙋‍♂️ Tawarkan Jasa" : "🔍 Cari Jasa"}
                </span>
              )}
              <span className="comic-tag bg-[var(--shinchan-yellow)] text-black-900 border-black-900 text-[9px]">
                <Tag size={8} />{post.category}
              </span>
              <span className="comic-tag bg-yellow-100 text-black-700 border-black-400 text-[9px]">
                <Calendar size={8} />{formattedDate}
              </span>
            </div>

            <h2 className="text-lg font-black leading-tight mb-3 text-gray-900">{post.title}</h2>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 border-2 border-black rounded-xl">
              {post.description}
            </p>

{post.userId && currentUser && currentUser.uid !== post.userId && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => onOpenChat && onOpenChat(post)}
                  className="comic-btn text-xs py-2 px-3 bg-blue-400 text-black border-black hover:bg-blue-300 font-bold">
                  <Send size={14} />
                   <span>Kirim DM</span>
                </button>
              </div>
            )}
          </div>

          <hr className="border-black/10" />

          {/* Discussion Section */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1">
              <MessageSquare size={14} /> Diskusi Komentar ({comments.length})
            </h4>

            {/* Comments List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {mainComments.length === 0 ? (
                <p className="text-center text-xs text-gray-400 font-bold py-6">Belum ada diskusi, yuk mulai bertanya!</p>
              ) : (
                mainComments.map((mainComment) => {
                  const replies = comments.filter(c => c.parentId === mainComment.id);

                  return (
                    <div key={mainComment.id} className="bg-gray-50/50 border-2 border-black p-3 rounded-xl shadow-[1.5px_1.5px_0px_#000] space-y-2">

                      {/* KOMENTAR UTAMA */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <div className="cursor-pointer mt-0.5" onClick={() => onOpenUserProfile(mainComment.userId)}>
                            <UserAvatar name={mainComment.userName} bgColor={mainComment.userAvatarColor} size="sm" />
                          </div>
                          <div>
                            {/* Menampilkan nama unik tanpa tag angka tambahan */}
                            <span className="text-xs font-black text-gray-900 cursor-pointer hover:underline" onClick={() => onOpenUserProfile(mainComment.userId)}>
                              {mainComment.userName}
                            </span>
                            <p className="text-xs text-gray-700 mt-0.5 bg-white px-2 py-1 border border-black/10 rounded-md shadow-sm break-all">
                              {renderCommentText(mainComment.text)}
                            </p>

                            {/* Tombol Aksi Reply Komentar Utama */}
                            {currentUser && (
                              <button
                                type="button"
                                onClick={() => setReplyTo({ id: mainComment.id, mainCommentId: mainComment.id, userName: mainComment.userName })}
                                className="text-[10px] text-blue-600 font-extrabold mt-1 hover:underline flex items-center gap-0.5"
                              >
                                Balas
                              </button>
                            )}
                          </div>
                        </div>

                        {currentUser && (currentUser.uid === mainComment.userId || currentUser.role === "admin") && (
                          <button onClick={() => handleCommentDelete(mainComment.id)}
                            className="text-red-700 hover:text-red-900 p-1 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors flex-shrink-0">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {/* AREA KOMENTAR REPLIES / BALASAN */}
                      {replies.length > 0 && (
                        <div className="ml-6 pl-3 border-l-2 border-black/20 space-y-2 pt-1">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex flex-col bg-white/70 p-2 border border-black/10 rounded-lg shadow-inner gap-1">

                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <div className="cursor-pointer mt-0.5" onClick={() => onOpenUserProfile(reply.userId)}>
                                    <UserAvatar name={reply.userName} bgColor={reply.userAvatarColor} size="sm" />
                                  </div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-1 min-w-0">
                                      {/* Menampilkan nama unik pengirim balasan secara polosan */}
                                      <span className="text-xs font-black text-gray-900 cursor-pointer hover:underline break-all" onClick={() => onOpenUserProfile(reply.userId)}>
                                        {reply.userName}
                                      </span>

                                      {/* Tag Indikator Target Balasan */}
                                      {reply.replyToCommentId && reply.replyToCommentId !== mainComment.id ? (
                                        <span className="text-[9px] text-blue-600 font-bold bg-blue-50 border border-blue-200 px-1 rounded flex items-center gap-0.5 break-all">
                                          @{reply.replyToUserName}
                                        </span>
                                      ) : (
                                        <span className="text-[9px] text-gray-400 font-bold flex items-center gap-0.5 bg-gray-100 px-1 rounded break-all">
                                          membalas
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-700 mt-0.5 break-all">{renderCommentText(reply.text)}</p>
                                  </div>
                                </div>

                                {currentUser && (currentUser.uid === reply.userId || currentUser.role === "admin") && (
                                  <button onClick={() => handleCommentDelete(reply.id)}
                                    className="text-red-700 hover:text-red-900 p-1 rounded transition-colors flex-shrink-0">
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>

                              {/* Tombol Balas Spesifik untuk Setiap Balasan (Threaded) */}
                              {currentUser && (
                                <div className="pl-10">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyTo({
                                        id: reply.id,
                                        mainCommentId: mainComment.id,
                                        userName: reply.userName
                                      });
                                      setCommentText(`@${reply.userName} `);
                                    }}
                                    className="text-[9px] text-blue-600 font-black hover:underline tracking-wide uppercase"
                                  >
                                    Balas
                                  </button>
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* Kotak Info Status Sedang Menulis Balasan */}
            {replyTo && (
              <div className="mt-3 flex items-center justify-between bg-blue-50 border-2 border-blue-400 px-3 py-1.5 rounded-lg text-[11px] font-bold text-blue-700 animate-fade-in">
                <span>Replying to <span className="underline">@{replyTo.userName}</span></span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-red-500 hover:text-red-700 underline text-[10px]"
                >
                  Batal
                </button>
              </div>
            )}

            {/* Comment form */}
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mt-2 space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={replyTo ? `Balas ulasan @${replyTo.userName}...` : "Ketik komentar diskusi..."}
                    className="comic-input text-xs flex-grow"
                    maxLength={1000}
                    required
                  />
                  <button type="submit" disabled={loading} className="comic-btn bg-[var(--shinchan-yellow)] text-xs font-bold flex-shrink-0">
                    <Send size={14} />
                    <span className="hidden sm:inline">{loading ? "..." : replyTo ? "Balas" : "Kirim"}</span>
                  </button>
                </div>

                {/* INDIKATOR BATAS KARAKTER */}
                <div className="text-right pr-1">
                  <span className={`text-[10px] font-black ${commentText.length >= 900 ? "text-red-500 animate-pulse" : "text-gray-400"}`}>
                    {commentText.length} / 1000 karakter {commentText.length >= 900 && "⚠️ Hampir Penuh!"}
                  </span>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-black/10 rounded-xl text-center text-xs font-bold text-gray-500 mt-4">
                🔒 Login untuk ikut berdiskusi di komentar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}