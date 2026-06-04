import React from "react";
import { MessageSquare, Phone, MapPin, Tag, Star } from "lucide-react";

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

export default function PostCard({ post, getUserRatingSummary, onOpenDetails, onOpenUserProfile }) {
  const ratingSummary = getUserRatingSummary(post.userId);

  const getWhatsAppUrl = () => {
    const cleanNumber = (post.whatsapp || "").replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Halo *${post.userName}*, saya melihat postingan Anda di *JasaGeh Lampung*:\n\n` +
      `*"${post.title}"*\n\nApakah masih tersedia? Saya ingin berdiskusi. Terima kasih!`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "";

  return (
    <article className="comic-box bg-white overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[var(--shinchan-yellow)]  border-b-3 border-black p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onOpenUserProfile(post.userId)}>
          <UserAvatar name={post.userName} bgColor={post.userAvatarColor} size="sm" />
          <div>
            <h4 className="text-xs font-extrabold group-hover:underline leading-tight">{post.userName}</h4>
            <div className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5">
              <MapPin size={10} />{post.region}
            </div>
          </div>
        </div>
        {ratingSummary.count > 0 ? (
          <div className="flex items-center gap-0.5 bg-[var(--shinchan-yellow)] border-2 border-black px-1.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_#000]"
            onClick={() => onOpenUserProfile(post.userId)}>
            <Star size={10} fill="currentColor" className="text-amber-500" />
            <span>{ratingSummary.average}</span>
            <span className="text-yellow-500 font-medium">({ratingSummary.count})</span>
          </div>
        ) : (
          <div className="text-[9px] bg-white border-2 border-black px-1.5 py-0.5 rounded-full text-gray-500 font-bold cursor-pointer"
            onClick={() => onOpenUserProfile(post.userId)}>
            Belum ada rating
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`comic-tag text-[9px] ${post.type === "offer" ? "bg-[var(--chocobi-green)] text-green-900 border-green-900" : "bg-[var(--pastel-pink)] text-red-900 border-red-900"}`}>
              {post.type === "offer" ? "🙋‍♂️ Tawarkan Jasa" : "🔍 Cari Jasa"}
            </span>
            <span className="comic-tag bg-[var(--pastel-blue)] text-blue-900 border-blue-900 text-[9px]">
              <Tag size={8} />{post.category}
            </span>
          </div>
          <h3 className="text-base font-extrabold mb-2 cursor-pointer line-clamp-2 hover:text-[var(--shinchan-red)] transition-colors leading-tight"
            onClick={() => onOpenDetails(post)}>
            {post.title}
          </h3>
          <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed mb-4">{post.description}</p>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold mb-3">{formattedDate}</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onOpenDetails(post)} className="comic-btn comic-btn-white text-xs py-2 px-1 justify-center">
              <MessageSquare size={14} />
              <span>Komen ({post.commentCount || 0})</span>
            </button>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="comic-btn text-xs py-2 px-1 justify-center bg-green-400 text-black border-black hover:bg-green-300 font-bold">
              <Phone size={14} /><span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
