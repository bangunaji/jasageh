import React, { useState } from "react";
import { X, Star, Eye, Send, Phone, MapPin, Tag } from "lucide-react";

function UserAvatar({ name, bgColor, size = "lg" }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const sizeClass = size === "lg" ? "w-20 h-20 text-4xl" : "w-8 h-8 text-sm";
  const bg = bgColor || "var(--pastel-pink)";
  return (
    <div className={`${sizeClass} border-3 border-black rounded-2xl overflow-hidden flex items-center justify-center shadow-[3px_3px_0px_#000] flex-shrink-0`} style={{ backgroundColor: bg }}>
      <span className="font-black text-gray-700">{initial}</span>
    </div>
  );
}

export default function UserProfileModal({ user, currentUser, onClose, onSubmitRating }) {
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reviews = user.ratings || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || submitting) return;
    setSubmitting(true);
    try {
      await onSubmitRating(user.id, ratingStars, reviewComment);
      setReviewComment("");
      setRatingStars(5);
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyRated = reviews.some(r => r.raterId === currentUser?.uid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="comic-box bg-white w-full max-w-lg overflow-hidden animate-bounce-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--shinchan-yellow)] p-4 border-b-3 border-black flex justify-between items-center">
          <h3 className="text-lg font-extrabold flex items-center gap-2">👤 Profil Pengguna</h3>
          <button onClick={onClose} className="comic-btn p-1.5 rounded-lg bg-white"><X size={16} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-5">
          {/* Main info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b-2 border-black/10">
            <UserAvatar name={user.name} bgColor={user.avatarColor} size="lg" />
            <div className="text-center sm:text-left space-y-1.5 flex-grow">
              <h2 className="text-xl font-black flex flex-wrap justify-center sm:justify-start items-center gap-2">
                {user.name}
                {user.isAdmin && (
                  <span className="text-[10px] uppercase font-black bg-[var(--shinchan-red)] text-white px-2 py-0.5 border-2 border-black rounded-full">Admin</span>
                )}
              </h2>
              <div className="text-xs font-bold text-gray-500 flex flex-wrap justify-center sm:justify-start items-center gap-3">
                <span className="flex items-center gap-0.5"><MapPin size={12} />{user.region}</span>
                <span className="flex items-center gap-1 bg-gray-100 border border-black/10 px-2 py-0.5 rounded text-gray-600">
                  <Eye size={12} />{user.views || 0} dilihat
                </span>
              </div>
              <div className="pt-1">
                <a href={`https://wa.me/${user.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="comic-btn text-xs bg-green-400 hover:bg-green-300 font-bold py-1.5 px-3">
                  <Phone size={12} /><span>+{user.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">Tentang</h4>
            <div className="comic-bubble bubble-left bg-[var(--shiro-white)] text-xs font-bold leading-relaxed text-gray-800">
              {user.bio || "Orang misterius ini belum menulis biodata..."}
            </div>
          </div>

          {/* Ratings overview */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">Kredibilitas & Rating</h4>
            <div className="grid grid-cols-2 gap-4 items-center bg-gray-50 p-4 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
              <div className="text-center sm:border-r border-black/10 py-2">
                {/* Menghitung rata-rata bintang langsung dari myReviews */}
                <div className="text-4xl font-black text-amber-500">
                  {myReviews.length > 0
                    ? (myReviews.reduce((sum, r) => sum + (r.stars || 0), 0) / myReviews.length).toFixed(1)
                    : "0.0"}
                </div>
                <div className="flex justify-center gap-0.5 text-amber-500 mt-1">
                  {[1, 2, 3, 4, 5].map(s => {
                    const avg = myReviews.length > 0
                      ? myReviews.reduce((sum, r) => sum + (r.stars || 0), 0) / myReviews.length
                      : 0;
                    return (
                      <Star key={s} size={14} fill={s <= Math.round(avg) ? "currentColor" : "none"} />
                    );
                  })}
                </div>
                {/* Menggunakan panjang array myReviews secara real-time */}
                <p className="text-[10px] text-gray-500 font-bold mt-1">dari {myReviews.length} ulasan</p>
              </div>
              <div className="p-2 space-y-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Kategori:</div>
                <div className="flex flex-wrap gap-1">
                  {currentUser?.categories?.length > 0
                    ? currentUser.categories.map(cat => (
                      <span key={cat} className="comic-tag bg-[var(--pastel-orange)] text-[9px]">{cat}</span>
                    ))
                    : <span className="text-[10px] text-gray-400 font-bold">Semua Kategori</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">
              Ulasan ({reviews.length})
            </h4>
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 font-bold italic py-2 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                Belum ada ulasan. Jadilah yang pertama!
              </p>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-3 border-2 border-black rounded-xl bg-white shadow-[1.5px_1.5px_0px_#000]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold">{rev.raterName}</span>
                      <div className="flex gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={10} fill={s <= rev.stars ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-700 font-medium leading-normal">{rev.comment}</p>
                    <div className="text-[9px] text-gray-400 text-right mt-1">{rev.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review form */}
          {currentUser && currentUser.uid !== user.id && !alreadyRated && (
            <form onSubmit={handleSubmit} className="bg-[var(--pastel-blue)]/30 p-4 border-2 border-black rounded-xl">
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3">⭐ Beri Ulasan</h4>
              <div className="mb-3">
                <label className="block text-[10px] font-bold mb-1">Bintang:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRatingStars(star)} className="star-btn text-amber-500">
                      <Star size={22} fill={star <= ratingStars ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  className="comic-textarea text-xs py-1.5 px-2" rows={2} maxLength={150}
                  placeholder="Ceritakan pengalamanmu..." required />
              </div>
              <button type="submit" disabled={submitting}
                className="comic-btn bg-[var(--shinchan-yellow)] text-xs py-1.5 px-3 w-full justify-center">
                <Send size={12} /><span>{submitting ? "Mengirim..." : "Kirim Ulasan"}</span>
              </button>
            </form>
          )}
          {currentUser && currentUser.uid !== user.id && alreadyRated && (
            <div className="text-center text-xs text-gray-500 font-bold py-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              ✅ Anda sudah memberikan ulasan untuk pengguna ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
