import React, { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";

export default function MadingBoard({ madingList, currentUser, onAddMading, onDeleteMading, onLikeMading }) {
  const [newContent, setNewContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("#bae1ff");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: "Biru", value: "#bae1ff" }, { name: "Pink", value: "#ffb3ba" },
    { name: "Kuning", value: "#fff79a" }, { name: "Hijau", value: "#c4df9b" },
    { name: "Ungu", value: "#e8d7ff" }, { name: "Oranye", value: "#ffd3b6" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim() || loading) return;
    setLoading(true);
    try {
      await onAddMading(newContent.trim(), selectedColor);
      setNewContent("");
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold rotate-[-1deg] inline-block bg-[var(--shinchan-yellow)] px-4 py-2 border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] mb-2">
          📢 Mading Bangunjasa Lampung
        </h2>
        <p className="text-sm text-gray-600 font-bold">Papan informasi umum untuk berbagi pengumuman, lowongan kilat, atau info seputar Lampung!</p>
      </div>

      <div className="flex justify-end mb-4">
        {currentUser ? (
          <button onClick={() => setShowAddForm(!showAddForm)} className="comic-btn bg-[var(--chocobi-green)] hover:bg-green-300 font-bold">
            <Plus size={18} /><span>Tempel Pengumuman Baru</span>
          </button>
        ) : (
          <div className="comic-box bg-white px-4 py-2 text-xs font-bold text-gray-500 shadow-[2px_2px_0px_#000]">
            🔒 Login untuk menempel pengumuman.
          </div>
        )}
      </div>

      {showAddForm && currentUser && (
        <form onSubmit={handleSubmit} className="comic-box bg-white p-6 max-w-lg mx-auto mb-8 animate-bounce-in">
          <h3 className="text-lg font-extrabold mb-4">✏️ Tulis Pengumuman Baru</h3>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-2">Isi Pengumuman (maks. 250 karakter):</label>
            <textarea className="comic-textarea" rows={4} maxLength={250}
              placeholder="Contoh: Info lowongan kerja di Bandar Lampung..." value={newContent}
              onChange={e => setNewContent(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold mb-2">Pilih Warna Kertas:</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button key={color.value} type="button" onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 border-black transition-all ${selectedColor === color.value ? "scale-110 ring-2 ring-amber-400" : ""}`}
                  style={{ backgroundColor: color.value }} title={color.name} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowAddForm(false)} className="comic-btn comic-btn-white">Batal</button>
            <button type="submit" disabled={loading} className="comic-btn bg-[var(--shinchan-red)] text-white">
              {loading ? "Menempel..." : "Tempel Mading!"}
            </button>
          </div>
        </form>
      )}

      <div className="mading-board">
        {madingList.length === 0 ? (
          <div className="text-center py-12 text-amber-900 font-bold bg-[#efe0ca]/60 border-2 border-dashed border-[#8B5A2B] rounded-xl">
            <p className="text-xl">Mading masih kosong!</p>
            <p className="text-sm mt-1 text-amber-800">Jadilah yang pertama menempel pengumuman.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {madingList.map((mading, index) => {
              const rotation = ((index % 3) - 1) * 2;
              const isAuthor = currentUser?.uid === mading.userId;
              const isAdmin = currentUser?.isAdmin;
              return (
                <div key={mading.id} style={{ backgroundColor: mading.color, "--rotation": `${rotation}deg` }}
                  className="mading-note p-6 relative rounded-md min-h-[220px] flex flex-col justify-between">
                  <div className="mading-pin"></div>
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full border border-black overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mading.userAvatarColor || "var(--pastel-pink)" }}>
                          <span className="font-black text-[10px] text-gray-700">{(mading.userName || "?").charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-xs font-black text-gray-800 leading-tight">{mading.userName}</span>
                      </div>
                      {(isAuthor || isAdmin) && (
                        <button onClick={() => onDeleteMading(mading.id)}
                          className="text-red-700 hover:text-red-900 bg-white/40 hover:bg-white/70 p-1 rounded border border-black/10 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed break-words mb-4 whitespace-pre-line">{mading.content}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[9px] text-black/50 font-bold mb-3">
                      <Calendar size={10} /><span>{formatDate(mading.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => onLikeMading(mading.id)}
                        className={`reaction-btn ${mading.likes?.includes(currentUser?.uid) ? "bg-pink-100 text-pink-600 border-pink-300 shadow-[2px_2px_0px_#fbcfe8]" : ""}`}
                        title="Suka">
                        <span>❤️</span>
                        <span className="font-extrabold text-[10px]">{mading.likes?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
