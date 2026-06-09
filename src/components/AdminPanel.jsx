import { useState } from "react";
import {
  ShieldAlert, Trash2, Users, FileText, Megaphone,
  BarChart3, AlertTriangle, Edit2, Check, Shield, Plus, Bell
} from "lucide-react";

const BANNER_COLORS = [
  { name: "Kuning", value: "#fff79a" },
  { name: "Biru", value: "#bae1ff" },
  { name: "Pink", value: "#ffb3ba" },
  { name: "Hijau", value: "#c4df9b" },
  { name: "Ungu", value: "#e8d7ff" },
  { name: "Oranye", value: "#ffd3b6" },
  { name: "Merah", value: "#ff6b6b" },
];

export default function AdminPanel({
  posts = [],
  users = [],
  madingList = [],
  announcements = [],
  onDeletePost,
  onDeleteMading,
  onUpdateUser,
  onDeleteUser,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) {
  const [tab, setTab] = useState("stats");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editNameValue, setEditNameValue] = useState("");

  // Banner form state
  const [bannerText, setBannerText] = useState("");
  const [bannerColor, setBannerColor] = useState("#fff79a");
  const [addingBanner, setAddingBanner] = useState(false);

  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);

  const handleDelete = (type, id) => {
    if (confirmDelete?.id === id) {
      if (type === "post" && onDeletePost) onDeletePost(id);
      if (type === "mading" && onDeleteMading) onDeleteMading(id);
      if (type === "user" && onDeleteUser) onDeleteUser(id);
      if (type === "announcement" && onDeleteAnnouncement) onDeleteAnnouncement(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete({ type, id });
    }
  };

  const handleStartEditUser = (user) => {
    setEditingUserId(user.id);
    setEditNameValue(user.name || "");
  };

  const handleSaveUserEdit = async (userId) => {
    if (!editNameValue.trim()) return;
    if (onUpdateUser) await onUpdateUser(userId, { name: editNameValue.trim() });
    setEditingUserId(null);
  };

  const handleToggleAdmin = async (user) => {
    if (onUpdateUser) await onUpdateUser(user.id, { isAdmin: !user.isAdmin });
  };

  const handleAddBanner = async () => {
    if (!bannerText.trim() || !onAddAnnouncement) return;
    setAddingBanner(true);
    try {
      await onAddAnnouncement(bannerText.trim(), bannerColor);
      setBannerText("");
      setBannerColor("#fff79a");
    } finally {
      setAddingBanner(false);
    }
  };

  const tabs = [
    { key: "stats", label: "📊 Statistik", icon: <BarChart3 size={14} /> },
    { key: "announcements", label: "📣 Banner", icon: <Bell size={14} /> },
    { key: "posts", label: "📋 Postingan", icon: <FileText size={14} /> },
    { key: "mading", label: "📢 Mading", icon: <Megaphone size={14} /> },
    { key: "users", label: "👥 Users", icon: <Users size={14} /> },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 mt-6 mb-12">
      <div className="comic-box bg-white overflow-hidden shadow-[5px_5px_0px_#000]">

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
            Hapus konten bersifat permanen. Pastikan data yang dihapus benar.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b-3 border-black overflow-x-auto bg-gray-50">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 font-bold text-xs whitespace-nowrap border-r-2 border-black transition-colors ${tab === t.key ? "bg-[var(--shinchan-yellow)]" : "bg-white hover:bg-gray-100"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── STATS ── */}
          {tab === "stats" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Postingan", value: posts.length, bg: "bg-[var(--pastel-blue)]", emoji: "📋" },
                { label: "Total Komentar", value: totalComments, bg: "bg-[var(--pastel-pink)]", emoji: "💬" },
                { label: "Total Mading", value: madingList.length, bg: "bg-[var(--shinchan-yellow)]", emoji: "📢" },
                { label: "Total Users", value: users.length, bg: "bg-[var(--chocobi-green)]", emoji: "👥" },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} border-3 border-black rounded-xl p-4 text-center shadow-[3px_3px_0px_#000]`}>
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-[10px] font-bold text-gray-800 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {tab === "announcements" && (
            <div className="space-y-5">
              {/* Form tambah banner */}
              <div className="border-3 border-black rounded-xl p-4 bg-[var(--pastel-blue)] shadow-[3px_3px_0px_#000]">
                <h4 className="text-sm font-extrabold mb-3 flex items-center gap-1.5">
                  <Plus size={14} /> Tambah Banner Baru
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-600 tracking-wider mb-1">
                      Teks Pengumuman (maks. 150 karakter)
                    </label>
                    <textarea
                      value={bannerText}
                      onChange={e => setBannerText(e.target.value)}
                      maxLength={150}
                      rows={2}
                      placeholder="Contoh: Selamat datang di JasaGeh Lampung! Platform resmi jasa warga Lampung 🎉"
                      className="comic-textarea text-xs w-full"
                    />
                    <div className="text-[10px] text-right text-gray-400 font-bold mt-0.5">{bannerText.length}/150</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-600 tracking-wider mb-2">
                      Warna Banner
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {BANNER_COLORS.map(c => (
                        <button key={c.value} type="button"
                          onClick={() => setBannerColor(c.value)}
                          className={`w-7 h-7 rounded-md border-2 transition-all ${bannerColor === c.value ? "border-black scale-125 ring-2 ring-black" : "border-gray-400 hover:scale-110"}`}
                          style={{ backgroundColor: c.value }} title={c.name} />
                      ))}
                      {/* Preview */}
                      <div className="ml-2 px-3 py-1 border-2 border-black rounded-lg text-[10px] font-extrabold"
                        style={{ backgroundColor: bannerColor }}>
                        Preview Banner
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddBanner}
                    disabled={!bannerText.trim() || addingBanner}
                    className="comic-btn bg-[var(--shinchan-red)] text-white text-xs font-extrabold disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus size={14} />
                    {addingBanner ? "Menyimpan..." : "Pasang Banner"}
                  </button>
                </div>
              </div>

              {/* Daftar banner aktif */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-3">
                  Banner Aktif ({announcements.length})
                </h4>
                {announcements.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 font-bold py-8 border-2 border-dashed border-gray-300 rounded-xl">
                    Belum ada banner aktif.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {announcements.map(ann => (
                      <div key={ann.id}
                        className="flex items-center gap-3 border-2 border-black rounded-xl p-3 shadow-[1.5px_1.5px_0px_#000]"
                        style={{ backgroundColor: ann.color || "#fff79a" }}>
                        <Megaphone size={14} className="flex-shrink-0 text-black/60" />
                        <p className="flex-grow text-xs font-bold text-gray-900 line-clamp-2">{ann.text}</p>
                        <button
                          onClick={() => handleDelete("announcement", ann.id)}
                          className={`flex-shrink-0 p-2 border-2 border-black rounded-lg transition-all ${confirmDelete?.id === ann.id
                              ? "bg-red-500 text-white scale-105"
                              : "bg-white/60 hover:bg-red-100"
                            }`}
                          title={confirmDelete?.id === ann.id ? "Klik lagi untuk hapus!" : "Hapus banner"}>
                          {confirmDelete?.id === ann.id
                            ? <span className="text-[10px] font-black px-1">Yakin?</span>
                            : <Trash2 size={13} className="text-red-700" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── POSTS ── */}
          {tab === "posts" && (
            <div className="space-y-3">
              {posts.length === 0 ? (
                <p className="text-center text-sm text-gray-400 font-bold py-8">Belum ada postingan.</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="border-2 border-black rounded-xl p-3 flex justify-between items-center gap-3 bg-white shadow-[1.5px_1.5px_0px_#000]">
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold">oleh {post.userName}</p>
                    </div>
                    <button onClick={() => handleDelete("post", post.id)}
                      className={`p-2 border-2 border-black rounded-lg flex-shrink-0 transition-all ${confirmDelete?.id === post.id ? "bg-red-500 scale-105" : "bg-red-100 hover:bg-red-200"
                        }`}>
                      {confirmDelete?.id === post.id
                        ? <span className="text-[10px] font-black text-white px-1">Yakin?</span>
                        : <Trash2 size={14} className="text-red-700" />
                      }
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── MADING ── */}
          {tab === "mading" && (
            <div className="space-y-3">
              {madingList.length === 0 ? (
                <p className="text-center text-sm text-gray-400 font-bold py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  Belum ada mading.
                </p>
              ) : (
                madingList.map(mading => (
                  <div key={mading.id}
                    className="border-2 border-black rounded-xl p-3 flex justify-between items-center gap-3 bg-white shadow-[1.5px_1.5px_0px_#000]"
                    style={{ borderLeft: `6px solid ${mading.color || "#fff79a"}` }}>
                    <div className="min-w-0">
                      <p className="text-sm font-bold line-clamp-2">{mading.content}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">oleh {mading.userName}</p>
                    </div>
                    <button onClick={() => handleDelete("mading", mading.id)}
                      className={`p-2 border-2 border-black rounded-lg flex-shrink-0 transition-all ${confirmDelete?.id === mading.id ? "bg-red-500 scale-105" : "bg-red-100 hover:bg-red-200"
                        }`}>
                      {confirmDelete?.id === mading.id
                        ? <span className="text-[10px] font-black text-white px-1">Yakin?</span>
                        : <Trash2 size={14} className="text-red-700" />
                      }
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="border-2 border-black rounded-xl p-3 flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_#000]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: user.avatarColor }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-1">
                          <input className="border border-black px-1 text-xs" value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)} />
                          <button onClick={() => handleSaveUserEdit(user.id)}><Check size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">{user.name}</p>
                          <button onClick={() => handleStartEditUser(user)}><Edit2 size={10} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleAdmin(user)} className={user.isAdmin ? "text-amber-600" : "text-gray-400"}>
                      <Shield size={16} />
                    </button>
                    <button onClick={() => handleDelete("user", user.id)}
                      className={`p-1.5 border-2 border-black rounded-lg transition-all ${confirmDelete?.id === user.id ? "bg-red-500" : "bg-red-100 hover:bg-red-200"
                        }`}>
                      {confirmDelete?.id === user.id
                        ? <span className="text-[10px] font-black text-white px-1">Yakin?</span>
                        : <Trash2 size={14} className="text-red-700" />
                      }
                    </button>
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
