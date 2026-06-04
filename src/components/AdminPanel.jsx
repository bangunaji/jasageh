import React, { useState } from "react";
import { ShieldAlert, Trash2, Users, FileText, Megaphone, BarChart3, AlertTriangle } from "lucide-react";

export default function AdminPanel({ posts, users, madingList, onDeletePost, onDeleteMading }) {
  const [tab, setTab] = useState("stats");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);

  const handleDelete = (type, id) => {
    if (confirmDelete?.id === id) {
      if (type === "post") onDeletePost(id);
      if (type === "mading") onDeleteMading(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete({ type, id });
    }
  };

  const tabs = [
    { key: "stats", label: "📊 Statistik", icon: <BarChart3 size={14} /> },
    { key: "posts", label: "📋 Postingan", icon: <FileText size={14} /> },
    { key: "mading", label: "📢 Mading", icon: <Megaphone size={14} /> },
    { key: "users", label: "👥 Users", icon: <Users size={14} /> },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 mt-6">
      <div className="comic-box bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--shinchan-red)] p-5 border-b-3 border-black">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert size={24} /> Panel Admin
          </h2>
          <p className="text-xs text-red-100 font-bold mt-0.5">Kelola seluruh konten JasaGeh Lampung</p>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border-b-3 border-black px-5 py-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-[11px] font-bold text-amber-800">
            Klik tombol hapus <strong>sekali</strong> untuk konfirmasi, klik lagi untuk menghapus permanen.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b-3 border-black overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 font-bold text-xs whitespace-nowrap border-r-2 border-black transition-colors ${tab === t.key ? "bg-[var(--shinchan-yellow)]" : "bg-white hover:bg-gray-50"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* STATS */}
          {tab === "stats" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Postingan", value: posts.length, bg: "bg-[var(--pastel-blue)]", emoji: "📋" },
                { label: "Total Komentar", value: totalComments, bg: "bg-[var(--pastel-pink)]", emoji: "💬" },
                { label: "Total Mading", value: madingList.length, bg: "bg-[var(--shinchan-yellow)]", emoji: "📢" },
                { label: "Total Users", value: users.length, bg: "bg-[var(--chocobi-green)]", emoji: "👥" },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} border-3 border-black rounded-xl p-4 text-center shadow-[3px_3px_0px_#000]`}>
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-[10px] font-bold text-gray-700 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* POSTS */}
          {tab === "posts" && (
            <div className="space-y-3">
              {posts.length === 0 && <p className="text-center py-8 text-gray-500 font-bold">Tidak ada postingan.</p>}
              {posts.map(post => (
                <div key={post.id} className="border-2 border-black rounded-xl p-3 flex justify-between items-start gap-3 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#000]">
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black ${post.type === "offer" ? "bg-green-100 text-green-900" : "bg-pink-100 text-pink-900"}`}>
                        {post.type === "offer" ? "Tawarkan" : "Cari"} Jasa
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">{post.category}</span>
                    </div>
                    <h4 className="text-sm font-extrabold line-clamp-1">{post.title}</h4>
                    <p className="text-[11px] text-gray-500 font-bold">oleh {post.userName} · {post.region}</p>
                  </div>
                  <button onClick={() => handleDelete("post", post.id)}
                    className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 border-2 border-black rounded-lg transition-all shadow-[1.5px_1.5px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${confirmDelete?.id === post.id ? "bg-red-500 text-white animate-pulse" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                    <Trash2 size={12} />
                    <span className="hidden sm:inline">{confirmDelete?.id === post.id ? "Konfirmasi" : "Hapus"}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* MADING */}
          {tab === "mading" && (
            <div className="space-y-3">
              {madingList.length === 0 && <p className="text-center py-8 text-gray-500 font-bold">Tidak ada mading.</p>}
              {madingList.map(mading => (
                <div key={mading.id} style={{ borderLeftColor: mading.color }} className="border-2 border-black border-l-4 rounded-xl p-3 flex justify-between items-start gap-3 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#000]">
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold line-clamp-2">{mading.content}</p>
                    <p className="text-[11px] text-gray-500 font-bold mt-0.5">oleh {mading.userName}</p>
                  </div>
                  <button onClick={() => handleDelete("mading", mading.id)}
                    className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 border-2 border-black rounded-lg transition-all shadow-[1.5px_1.5px_0px_#000] ${confirmDelete?.id === mading.id ? "bg-red-500 text-white animate-pulse" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                    <Trash2 size={12} />
                    <span className="hidden sm:inline">{confirmDelete?.id === mading.id ? "Konfirmasi" : "Hapus"}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="space-y-3">
              {users.length === 0 && <p className="text-center py-8 text-gray-500 font-bold">Tidak ada pengguna terdaftar.</p>}
              {users.map(user => (
                <div key={user.id} className="border-2 border-black rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#000]">
                  <div className="w-10 h-10 rounded-lg border-2 border-black overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: user.avatarColor || "var(--pastel-blue)" }}>
                    <span className="font-black text-gray-700">{(user.name || "?").charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold line-clamp-1">{user.name}</h4>
                      {user.isAdmin && (
                        <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-300">Admin</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold">{user.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-bold text-gray-600">{user.region}</p>
                    <p className="text-[9px] text-gray-400 font-bold">👁️ {user.views || 0} dilihat</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
