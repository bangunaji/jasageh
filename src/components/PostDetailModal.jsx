import React, { useState, useEffect } from "react";
import { X, Send, Trash2, MessageSquare, Phone, MapPin, Tag, Calendar } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, increment } from "firebase/firestore";

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

export default function PostDetailModal({ post, currentUser, onClose, onOpenUserProfile }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  // Menentukan nama collection utama secara otomatis berdasarkan struktur data post
  const collectionName = post?.whatsapp || post?.region ? "posts" : "mading";

  // 1. Listener Komentar Otomatis
  useEffect(() => {
    if (!post?.id) return;

    const q = query(
      collection(db, collectionName, post.id, "comments"), // <-- Deteksi Otomatis
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [post?.id, collectionName]);

  // 2. Fungsi Submit Komentar Otomatis
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser || loading) return;

    setLoading(true);
    try {
      // Menyimpan komentar ke sub-collection yang sesuai (posts atau mading)
      await addDoc(collection(db, collectionName, post.id, "comments"), {
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.displayName,
        userAvatarColor: currentUser.avatarColor || "#ffb3ba",
        text: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      // Update counter commentCount langsung ke target dokumen utama yang benar
      const postRef = doc(db, collectionName, post.id);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });

      setCommentText("");
    } catch (err) {
      console.error("Gagal menambah komentar:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Hapus Komentar Otomatis
  const handleDeleteComment = async (commentId) => {
    try {
      // Hapus dari sub-collection yang sesuai
      await deleteDoc(doc(db, collectionName, post.id, "comments", commentId));

      // Kurangi counter di dokumen utama yang sesuai
      const postRef = doc(db, collectionName, post.id);
      await updateDoc(postRef, {
        commentCount: increment(-1)
      });
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
    }
  };

  const getWhatsAppUrl = () => {
    const cleanNumber = (post.whatsapp || "").replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Halo *${post.userName}*, saya tertarik dengan postingan Anda di *JasaGeh Lampung*:\n\n*"${post.title}"*\n\nApakah masih tersedia? Mari mengobrol!`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="comic-box bg-white w-full max-w-2xl overflow-hidden animate-bounce-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--pastel-blue)] p-4 border-b-3 border-black flex justify-between items-center">
          <h3 className="text-base md:text-lg font-extrabold line-clamp-1 flex-grow">{post.title}</h3>
          <button onClick={onClose} className="comic-btn p-1.5 rounded-lg bg-white ml-2 flex-shrink-0"><X size={16} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* Publisher */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-black/10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { onClose(); onOpenUserProfile(post.userId); }}>
              <UserAvatar name={post.userName} bgColor={post.userAvatarColor} size="md" />
              <div>
                <h4 className="text-sm font-extrabold group-hover:underline">{post.userName}</h4>
                <p className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5"><MapPin size={11} />{post.region}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`comic-tag text-[9px] ${post.type === "offer" ? "bg-[var(--chocobi-green)] text-green-950 border-green-950" : "bg-[var(--pastel-pink)] text-red-950 border-red-950"}`}>
                {post.type === "offer" ? "🙋‍♂️ Tawarkan Jasa" : "🔍 Cari Jasa"}
              </span>
              <span className="comic-tag bg-[var(--pastel-orange)] text-[9px]"><Tag size={10} />{post.category}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">Deskripsi</h4>
            <div className="p-4 border-2 border-black bg-[var(--shiro-white)] rounded-xl text-sm font-semibold leading-relaxed whitespace-pre-line shadow-[2px_2px_0px_#000]">
              {post.description}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="comic-box-static bg-green-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h5 className="font-extrabold text-xs text-green-800">Tertarik bekerja sama?</h5>
              <p className="text-[10px] text-gray-500 font-bold">Hubungi langsung via WhatsApp untuk negosiasi.</p>
            </div>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="comic-btn w-full sm:w-auto justify-center bg-green-400 text-black border-black hover:bg-green-300 font-bold text-xs">
              <Phone size={14} /><span>Kirim Pesan WhatsApp</span>
            </a>
          </div>

          {/* Comments */}
          <div className="space-y-4 pt-4 border-t-2 border-black/10">
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
              <MessageSquare size={14} />Diskusi Komentar ({comments.length})
            </h4>

            {/* List Komentar */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-500 font-bold italic py-4 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  Belum ada komentar. Tulis komentar pertama!
                </p>
              ) : (
                comments.map((comment) => {
                  const isOwner = currentUser?.uid === comment.userId;
                  const isAdmin = currentUser?.isAdmin;
                  return (
                    <div key={comment.id} className="p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_#000] flex justify-between items-start gap-2 animate-bounce-in">
                      <div className="flex gap-2">
                        <UserAvatar name={comment.userName} bgColor={comment.userAvatarColor} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-extrabold text-black">{comment.userName || "Anonim"}</span>
                            <span className="text-[9px] text-gray-400 font-bold">{formatDate(comment.createdAt)}</span>
                          </div>
                          {/* Warna teks diubah ke text-gray-900 (Hitam pekat) agar terbaca jelas */}
                          <p className="text-xs text-gray-900 font-bold mt-1 leading-relaxed break-words">
                            {comment.text || comment.content}
                          </p>
                        </div>
                      </div>

                      {(isOwner || isAdmin) && (
                        <button onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-700 hover:text-red-900 p-1 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors flex-shrink-0">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment form */}
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ketik komentar diskusi..."
                  className="comic-input text-xs flex-grow"
                  maxLength={200}
                  required
                />
                <button type="submit" disabled={loading} className="comic-btn bg-[var(--shinchan-yellow)] text-xs font-bold">
                  <Send size={14} />
                  <span className="hidden sm:inline">{loading ? "..." : "Kirim"}</span>
                </button>
              </form>
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-black/10 rounded-xl text-center text-xs font-bold text-gray-500">
                🔒 Login untuk ikut berdiskusi di komentar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
