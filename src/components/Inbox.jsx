import React from "react";
import { MessageSquare } from "lucide-react";

export default function Inbox({ conversations, currentUser, onOpenChat }) {
  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <div className="comic-box bg-white p-6 animate-bounce-in">
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2 border-b-4 border-black pb-4">
          <MessageSquare className="text-[var(--shinchan-red)]" size={28} />
          Kotak Masuk
        </h2>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-xl font-extrabold">Belum ada pesan</h3>
            <p className="text-sm font-bold text-gray-500 mt-2">Mulai tawarkan jasamu atau sapa seseorang untuk memulai percakapan!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              // Find the other participant's ID
              const otherUserId = conv.participants.find(id => id !== currentUser.uid);
              if (!otherUserId) return null;

              const otherUserData = conv.participantsData?.[otherUserId] || { name: "Pengguna", avatarColor: "#ccc" };
              const unreadCount = conv.unreadCount?.[currentUser.uid] || 0;
              const isUnread = unreadCount > 0;

              // Format date
              let timeString = "";
              if (conv.lastMessageAt?.toDate) {
                const date = conv.lastMessageAt.toDate();
                const now = new Date();
                const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                if (isToday) {
                  timeString = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                } else {
                  timeString = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                }
              }

              return (
                <div
                  key={conv.id}
                  onClick={() => onOpenChat({ id: otherUserId, name: otherUserData.name, avatarColor: otherUserData.avatarColor })}
                  className={`flex items-center gap-4 p-4 border-2 border-black rounded-xl cursor-pointer transition-transform hover:scale-[1.01] shadow-[2px_2px_0px_#000] ${
                    isUnread ? "bg-[var(--shinchan-yellow)]" : "bg-gray-50"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 flex-shrink-0 border-2 border-black rounded-xl flex items-center justify-center bg-white shadow-[1px_1px_0px_#000]"
                    style={{ backgroundColor: otherUserData.avatarColor }}
                  >
                    <span className="font-black text-lg">{(otherUserData.name || "?").charAt(0).toUpperCase()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm truncate pr-2 ${isUnread ? "font-extrabold text-black" : "font-bold text-gray-800"}`}>
                        {otherUserData.name}
                      </h3>
                      {timeString && (
                        <span className={`text-[10px] whitespace-nowrap font-bold ${isUnread ? "text-[var(--shinchan-red)]" : "text-gray-500"}`}>
                          {timeString}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-500"}`}>
                      {conv.lastMessageBy === currentUser.uid && "Anda: "}
                      {conv.lastMessage || "Mulai percakapan baru"}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {isUnread && (
                    <div className="w-6 h-6 rounded-full bg-[var(--shinchan-red)] border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
                      <span className="text-[10px] font-black text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
