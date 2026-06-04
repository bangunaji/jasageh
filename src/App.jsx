import React, { useState, useEffect, useRef } from "react";
import { auth, db, googleProvider } from "./firebase";
import {
  onAuthStateChanged, signInWithPopup, signOut
} from "firebase/auth";
import {
  collection, doc, addDoc, deleteDoc, updateDoc, getDoc, setDoc,
  onSnapshot, serverTimestamp, query, orderBy, increment, arrayUnion, arrayRemove
} from "firebase/firestore";


import Header from "./components/Header";
import PostCard from "./components/PostCard";
import MadingBoard from "./components/MadingBoard";
import AdminPanel from "./components/AdminPanel";
import UserProfileModal from "./components/UserProfileModal";
import PostDetailModal from "./components/PostDetailModal";

import {
  Search, Filter, X, Plus, ChevronDown, Trash2, Star, MapPin, Tag, Loader2
} from "lucide-react";

const CATEGORIES = [
  "Semua Kategori","Teknologi & IT","Desain & Kreatif","Pendidikan & Les Privat",
  "Kuliner & Katering","Otomotif & Servis","Rumah & Bangunan","Kesehatan & Kecantikan","Lainnya"
];
const REGIONS = [
  "Semua Wilayah","Kota Bandar Lampung","Kota Metro","Kab. Lampung Selatan",
  "Kab. Lampung Tengah","Kab. Lampung Timur","Kab. Lampung Utara","Kab. Lampung Barat",
  "Kab. Tulang Bawang","Kab. Tulang Bawang Barat","Kab. Tanggamus","Kab. Pesawaran",
  "Kab. Pringsewu","Kab. Mesuji","Kab. Way Kanan","Kab. Pesisir Barat"
];

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="comic-box bg-[var(--shinchan-yellow)] p-8 text-center animate-bounce-in">
        <div className="text-5xl mb-4 animate-float">🎒</div>
        <Loader2 size={32} className="animate-spin mx-auto text-[var(--shinchan-red)] mb-2" />
        <p className="font-extrabold text-lg">Memuat JasaGeh...</p>
      </div>
    </div>
  );
}

function UserAvatar({ name, bgColor, size = "sm" }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const sizeClass = size === "sm" ? "w-8 h-8 text-sm" : size === "md" ? "w-12 h-12 text-xl" : "w-20 h-20 text-4xl";
  const bg = bgColor || "var(--pastel-pink)";
  return (
    <div className={`${sizeClass} border-2 border-black rounded-xl overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_#000] flex-shrink-0`} style={{ backgroundColor: bg }}>
      <span className="font-black text-gray-700">{initial}</span>
    </div>
  );
}

const AVATAR_COLORS = ["#ffb3ba", "#bae1ff", "#fff79a", "#c4df9b", "#e8d7ff", "#ffd3b6"];

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data state
  const [posts, setPosts] = useState([]);
  const [madingList, setMadingList] = useState([]);
  const [users, setUsers] = useState([]);

  // UI state
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua Kategori");
  const [filterRegion, setFilterRegion] = useState("Semua Wilayah");
  const [activeTab, setActiveTab] = useState("offer");
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

  // Form state
  const [newPost, setNewPost] = useState({ title: "", description: "", category: "", region: "", whatsapp: "", type: "offer" });

  // ─── Firebase Auth Listener ───────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          // New user — create Firestore document
          const newUserData = {
            name: firebaseUser.displayName || "Pengguna Baru",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || null,
            whatsapp: "",
            region: "Kota Bandar Lampung",
            bio: "",
            views: 0,
            categories: [],
            isAdmin: false,
            avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newUserData);
          setCurrentUser({ uid: firebaseUser.uid, ...newUserData, isAdmin: false });
        } else {
          // Existing user — update photoURL if changed from Google
          const data = snap.data();
          setCurrentUser({ uid: firebaseUser.uid, ...data });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ─── Firestore Real-time Listeners ───────────────────────────────
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "mading"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const now = Date.now();
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      const loaded = [];
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.createdAt) {
          const madingTime = data.createdAt.toMillis ? data.createdAt.toMillis() : new Date(data.createdAt).getTime();
          if (now - madingTime > fiveDaysMs) {
            deleteDoc(doc(db, "mading", d.id)).catch(() => {});
            return;
          }
        }
        loaded.push({ id: d.id, ...data });
      });
      setMadingList(loaded);
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // ─── Auth Handlers ───────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login gagal:", err);
      alert("Login gagal. Pastikan popup tidak diblokir browser.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView("home");
  };

  // ─── Post Handlers ───────────────────────────────────────────────
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPost.title.trim() || !newPost.description.trim() || !newPost.category || !newPost.region || !newPost.whatsapp) {
      alert("Harap isi semua field!"); return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        ...newPost,
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.displayName,
        userAvatarColor: currentUser.avatarColor || "#ffb3ba",
        commentCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewPost({ title: "", description: "", category: "", region: "", whatsapp: "", type: "offer" });
      setShowAddPostForm(false);
    } catch (err) {
      console.error("Gagal tambah postingan:", err);
      alert("Gagal menambah postingan.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Hapus postingan ini permanen?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      if (selectedPost?.id === postId) setSelectedPost(null);
    } catch (err) {
      console.error("Gagal hapus postingan:", err);
      alert("Gagal menghapus postingan.");
    }
  };

  // ─── Mading Handlers ─────────────────────────────────────────────
  const handleAddMading = async (content, color) => {
    if (!currentUser) return;
    await addDoc(collection(db, "mading"), {
      userId: currentUser.uid,
      userName: currentUser.name || currentUser.displayName,
      userAvatarColor: currentUser.avatarColor || "#ffb3ba",
      content,
      color,
      likes: [],
      createdAt: serverTimestamp(),
    });
  };

  const handleDeleteMading = async (madingId) => {
    await deleteDoc(doc(db, "mading", madingId));
  };

  const handleLikeMading = async (madingId) => {
    if (!currentUser) { alert("Silakan login untuk menyukai mading!"); return; }
    const mading = madingList.find(m => m.id === madingId);
    if (!mading) return;
    
    const hasLiked = mading.likes?.includes(currentUser.uid);
    const madingRef = doc(db, "mading", madingId);
    
    if (hasLiked) {
      await updateDoc(madingRef, { likes: arrayRemove(currentUser.uid) });
    } else {
      await updateDoc(madingRef, { likes: arrayUnion(currentUser.uid) });
    }
  };

  // ─── Rating Handler ──────────────────────────────────────────────
  const handleSubmitRating = async (targetUserId, stars, comment) => {
    if (!currentUser) return;
    const ratingData = {
      raterId: currentUser.uid,
      raterName: currentUser.name || currentUser.displayName,
      stars,
      comment,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
    await addDoc(collection(db, "users", targetUserId, "ratings"), ratingData);
  };

  // ─── Open User Profile ────────────────────────────────────────────
  const handleOpenUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;
    const userData = { id: userId, ...snap.data() };

    // Load ratings subcollection
    const ratingsSnap = await new Promise(resolve => {
      const q = query(collection(db, "users", userId, "ratings"), orderBy("date", "desc"));
      onSnapshot(q, resolve, { once: true });
    });
    const ratings = ratingsSnap.docs?.map(d => ({ id: d.id, ...d.data() })) || [];
    userData.ratings = ratings;

    // Increment view count if not own profile
    if (currentUser && currentUser.uid !== userId) {
      await updateDoc(userRef, { views: increment(1) });
    }

    setSelectedUserProfile(userData);
  };



  // ─── Change Avatar Color ──────────────────────────────────────────
  const handleChangeAvatarColor = async (color) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { avatarColor: color });
      setCurrentUser(prev => ({ ...prev, avatarColor: color }));
    } catch (err) {
      console.error("Gagal ganti warna avatar:", err);
    }
  };

  // ─── Get Rating Summary ───────────────────────────────────────────
  const getUserRatingSummary = (userId) => {
    const user = users.find(u => u.id === userId);
    const ratings = user?.ratingsCache || [];
    if (!ratings.length) return { average: 0, count: 0 };
    const avg = (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1);
    return { average: avg, count: ratings.length };
  };

  // ─── Filtered Posts ───────────────────────────────────────────────
  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCategory = filterCategory === "Semua Kategori" || p.category === filterCategory;
    const matchRegion = filterRegion === "Semua Wilayah" || p.region === filterRegion;
    const matchTab = p.type === activeTab;
    return matchSearch && matchCategory && matchRegion && matchTab;
  });

  // ─── My Posts (for profile) ───────────────────────────────────────
  const myPosts = currentUser ? posts.filter(p => p.userId === currentUser.uid) : [];

  if (authLoading) return <LoadingSpinner />;

  // ─── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Header
        currentUser={currentUser}
        onLoginClick={handleGoogleLogin}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* ── HOME VIEW ── */}
      {currentView === "home" && (
        <main className="max-w-6xl mx-auto px-4">
          {/* Hero */}
          <div className="comic-box bg-[var(--shinchan-yellow)] p-6 mb-8 text-center rotate-[-0.5deg] hover:rotate-0 transition-all">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              🎒 JasaGeh Lampung!
            </h1>
            <p className="text-sm md:text-base font-bold text-gray-700 max-w-xl mx-auto">
              Platform pertemuan jasa <strong>Provinsi Lampung</strong>. Tawarkan keahlianmu atau temukan orang yang kamu butuhkan!
            </p>
            {currentUser && (
              <button onClick={() => setShowAddPostForm(!showAddPostForm)}
                className="comic-btn bg-[var(--shinchan-red)] text-white mt-4 mx-auto font-extrabold text-sm">
                <Plus size={18} />
                {showAddPostForm ? "Batal" : "Buat Postingan Baru"}
              </button>
            )}
          </div>

          {/* Add Post Form */}
          {showAddPostForm && currentUser && (
            <div className="comic-box bg-white p-6 mb-8 animate-bounce-in">
              <h3 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                ✏️ Buat Postingan Baru
              </h3>
              <form onSubmit={handleAddPost} className="space-y-4">
                {/* Type selection */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-2">Tipe Postingan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setNewPost(p => ({ ...p, type: "offer" }))}
                      className={`comic-btn py-3 justify-center text-sm transition-all ${newPost.type === "offer" ? "bg-[var(--chocobi-green)] border-black scale-[1.02] shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#e6f4cd]"}`}>
                      🙋‍♂️ Saya Tawarkan Jasa
                    </button>
                    <button type="button" onClick={() => setNewPost(p => ({ ...p, type: "need" }))}
                      className={`comic-btn py-3 justify-center text-sm transition-all ${newPost.type === "need" ? "bg-[var(--pastel-pink)] border-black scale-[1.02] shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#ffe3e6]"}`}>
                      🔍 Saya Cari Jasa
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-1">Judul</label>
                    <input type="text" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                      className="comic-input text-sm" placeholder="Contoh: Jasa Edit Video Profesional" maxLength={80} required />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-1">No. WhatsApp</label>
                    <input type="tel" value={newPost.whatsapp} onChange={e => setNewPost(p => ({ ...p, whatsapp: e.target.value }))}
                      className="comic-input text-sm" placeholder="628xxxxxxxxxx" required />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-1">Kategori</label>
                    <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                      className="comic-select text-sm" required>
                      <option value="">Pilih kategori...</option>
                      {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-1">Wilayah Lampung</label>
                    <select value={newPost.region} onChange={e => setNewPost(p => ({ ...p, region: e.target.value }))}
                      className="comic-select text-sm" required>
                      <option value="">Pilih wilayah...</option>
                      {REGIONS.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider mb-1">Deskripsi</label>
                  <textarea value={newPost.description} onChange={e => setNewPost(p => ({ ...p, description: e.target.value }))}
                    className="comic-textarea text-sm" rows={4} maxLength={600}
                    placeholder="Jelaskan jasa/kebutuhan kamu secara detail..." required />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddPostForm(false)} className="comic-btn bg-white text-sm">Batal</button>
                  <button type="submit" className="comic-btn bg-[var(--shinchan-red)] text-white font-extrabold text-sm">
                    <Plus size={16} /> Posting Sekarang!
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="comic-box bg-white p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="comic-input pl-9 text-sm" placeholder="Cari jasa, keahlian, kata kunci..." />
              </div>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="comic-select text-sm md:w-52">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="comic-select text-sm md:w-52">
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {(searchQuery || filterCategory !== "Semua Kategori" || filterRegion !== "Semua Wilayah") && (
                <button onClick={() => { setSearchQuery(""); setFilterCategory("Semua Kategori"); setFilterRegion("Semua Wilayah"); }}
                  className="comic-btn bg-white text-xs"><X size={14} /> Reset</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-3 border-black rounded-xl overflow-hidden mb-6 shadow-[3px_3px_0px_#000]">
            <button onClick={() => setActiveTab("offer")}
              className={`flex-1 py-3 font-extrabold text-sm transition-colors ${activeTab === "offer" ? "bg-[var(--chocobi-green)] border-r-2 border-black" : "bg-white hover:bg-gray-50 border-r-2 border-black"}`}>
              🙋‍♂️ Tawarkan Jasa
            </button>
            <button onClick={() => setActiveTab("need")}
              className={`flex-1 py-3 font-extrabold text-sm transition-colors ${activeTab === "need" ? "bg-[var(--pastel-pink)]" : "bg-white hover:bg-gray-50"}`}>
              🔍 Cari Jasa
            </button>
          </div>

          {/* Post Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🔍</p>
              <h3 className="text-xl font-extrabold">Postingan tidak ditemukan</h3>
              <p className="text-sm text-gray-500 font-bold mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} getUserRatingSummary={getUserRatingSummary}
                  onOpenDetails={(p) => setSelectedPost(p)} onOpenUserProfile={handleOpenUserProfile} />
              ))}
            </div>
          )}
        </main>
      )}

      {/* ── MADING VIEW ── */}
      {currentView === "mading" && (
        <MadingBoard madingList={madingList} currentUser={currentUser}
          onAddMading={handleAddMading} onDeleteMading={handleDeleteMading} onLikeMading={handleLikeMading} />
      )}

      {/* ── ADMIN VIEW ── */}
      {currentView === "admin" && currentUser?.isAdmin && (
        <AdminPanel posts={posts} users={users} madingList={madingList}
          onDeletePost={handleDeletePost} onDeleteMading={handleDeleteMading} />
      )}

      {/* ── PROFILE VIEW ── */}
      {currentView === "profile" && currentUser && (
        <section className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
          {/* Profile Card */}
          <div className="comic-box bg-white p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 border-3 border-black rounded-2xl overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_#000]"
                  style={{ backgroundColor: currentUser.avatarColor || "var(--pastel-pink)" }}>
                  <span className="text-5xl font-black text-gray-700">{(currentUser.name || "?").charAt(0).toUpperCase()}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-extrabold flex flex-wrap justify-center sm:justify-start items-center gap-2">
                  {currentUser.name || currentUser.displayName}
                  {currentUser.isAdmin && (
                    <span className="text-xs bg-[var(--shinchan-red)] text-white px-2 py-0.5 border-2 border-black rounded-full font-black">Admin</span>
                  )}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase mr-1">Warna Avatar:</span>
                  <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                    {AVATAR_COLORS.map(c => (
                      <button key={c} onClick={() => handleChangeAvatarColor(c)}
                        className={`w-5 h-5 rounded-md border-2 transition-transform ${currentUser.avatarColor === c ? "border-black scale-110" : "border-transparent hover:scale-110"}`}
                        style={{ backgroundColor: c }} title="Pilih warna ini" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-500">{currentUser.email}</p>
                <p className="text-xs font-bold text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin size={12} />{currentUser.region || "Wilayah belum diatur"}
                </p>
              </div>
            </div>
          </div>

          {/* My Posts */}
          <div className="comic-box bg-white overflow-hidden">
            <div className="bg-[var(--pastel-purple)] p-4 border-b-3 border-black">
              <h3 className="text-lg font-extrabold">📋 Postingan Saya ({myPosts.length})</h3>
            </div>
            <div className="p-4 space-y-3">
              {myPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="font-bold text-gray-500 text-sm">Belum ada postingan.</p>
                  <button onClick={() => { setCurrentView("home"); setShowAddPostForm(true); }}
                    className="comic-btn bg-[var(--shinchan-yellow)] text-xs mt-3">
                    <Plus size={14} /> Buat Postingan Pertama
                  </button>
                </div>
              ) : (
                myPosts.map(post => (
                  <div key={post.id} className="border-2 border-black rounded-xl p-3 flex justify-between items-start gap-3 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#000]">
                    <div className="flex-grow min-w-0 cursor-pointer" onClick={() => setSelectedPost(post)}>
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black ${post.type === "offer" ? "bg-green-100 text-green-900" : "bg-pink-100 text-pink-900"}`}>
                          {post.type === "offer" ? "🙋‍♂️ Tawarkan" : "🔍 Cari"} Jasa
                        </span>
                        <span className="text-[9px] font-bold bg-[var(--pastel-orange)] border border-black px-1.5 py-0.5 rounded-full">{post.category}</span>
                      </div>
                      <h4 className="text-sm font-extrabold line-clamp-1 hover:underline">{post.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5 mt-0.5">
                        <MapPin size={10} />{post.region}
                      </p>
                    </div>
                    <button onClick={() => handleDeletePost(post.id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg border-2 border-transparent hover:border-red-200 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── MODALS ── */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} currentUser={currentUser}
          onClose={() => setSelectedPost(null)} onOpenUserProfile={handleOpenUserProfile} />
      )}
      {selectedUserProfile && (
        <UserProfileModal user={selectedUserProfile} currentUser={currentUser}
          onClose={() => setSelectedUserProfile(null)} onSubmitRating={handleSubmitRating} />
      )}
    </div>
  );
}
