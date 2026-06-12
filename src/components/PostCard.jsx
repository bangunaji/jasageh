import React from "react";
import { MessageSquare, Send, MapPin, Tag, Star } from "lucide-react";

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

export default function PostCard({ post, getUserRatingSummary, onOpenDetails, onOpenUserProfile, onOpenChat, currentUser, unreadCounts }) {
  const ratingSummary = getUserRatingSummary(post.userId);

  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : post.createdAt
       ? new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
       : "";

   let unreadCount = 0;
   if (currentUser && post.userId && currentUser.uid !== post.userId) {
     const participants = [currentUser.uid, post.userId].sort();
     const conversationId = participants.join("_");
     unreadCount = unreadCounts[conversationId] || 0;
   }

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
            <span className={`comic-tag text-[9px] ${post.type === "offer" ? "bg-[var(--shinchan-yellow)] text-black-900 border-black-900" : "bg-[var(--shinchan-yellow)] text-black-900 border-black-900"}`}>
              {post.type === "offer" ? "🙋‍♂️ Tawarkan Jasa" : "🔍 Cari Jasa"}
            </span>
            <span className="comic-tag bg-[var(--shinchan-yellow)] text-black-900 border-black-900 text-[9px]">
              <Tag size={8} />{post.category}
            </span>
          </div>
          <h3 className="text-base font-extrabold mb-2 cursor-pointer line-clamp-2 hover:text-[var(--shinchan-red)] transition-colors leading-tight"
            onClick={() => onOpenDetails(post)}>
            {post.title}
          </h3>

          {/* Menampilkan foto jika ada */}
          {post.imageUrl && (
            <div className="mb-3 w-full h-32 rounded-xl overflow-hidden border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer" onClick={() => onOpenDetails(post)}>
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          )}

          <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed mb-2 break-all">{post.description}</p>

          {/* Tambahkan ini untuk menampilkan harga */}
          {post.price && (
            <div className="text-xs font-black text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 mb-3 inline-block">
              Rp {parseInt(post.price).toLocaleString('id-ID')}
            </div>
          )}
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold mb-3">{formattedDate}</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onOpenDetails(post)} className="comic-btn comic-btn-white text-xs py-2 px-1 justify-center">
              <MessageSquare size={14} />
              <span>Komen ({post.commentCount || 0})</span>
            </button>
             <button onClick={() => onOpenChat(post)}
               className="relative comic-btn text-xs py-2 px-1 justify-center bg-blue-400 text-black border-black hover:bg-blue-300 font-bold">
               <Send size={14} /><span>DM</span>
               {unreadCount > 0 && (
                 <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-red-500 text-white text-xs rounded-full">
                   {unreadCount}
                 </div>
               )}
             </button>
          </div>
        </div>
      </div>
    </article>
  );
}
