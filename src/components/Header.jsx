import React from "react";
import { LogIn, LogOut, ShieldAlert, MapPin } from "lucide-react";

export default function Header({ currentUser, onLoginClick, onLogout, currentView, setCurrentView, totalUnread }) {
  const getCharacterDialogue = () => {
    if (!currentUser) return "Hehehe... Belum login ya? Login pakai Akun Google-mu geh!";
    const name = currentUser.name || currentUser.displayName || "kamu";
    if (currentUser.isAdmin) return "Mode Administrator Aktif. Mari jaga komunitas Bangunjasa Lampung! 🔑";
    return `Halo ${name.split(" ")[0]}! Mau tawarkan jasa atau cari jasa hari ini? 😄`;
  };

  const displayName = currentUser?.name || currentUser?.displayName || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="mb-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--shinchan-yellow)] border-b-4 border-black p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("home")}>
            <div className="bg-[var(--shinchan-red)] border-3 border-black p-2 rounded-xl text-white font-bold text-xl md:text-2xl shadow-[2px_2px_0px_#000] rotate-[-2deg] hover:rotate-[2deg] transition-all">
              JasaGeh!
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-widest text-[var(--comic-black)] uppercase">Lampung</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl animate-float hidden sm:inline-block">🎒</span>
            <div className="comic-bubble bubble-left bg-white text-xs md:text-sm font-semibold max-w-sm md:max-w-md">
              {getCharacterDialogue()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold bg-white/50 px-3 py-1 border-2 border-black rounded-full">
          <MapPin size={16} />
          <span>Provinsi Lampung, ID</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="comic-box bg-[var(--pastel-orange)] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setCurrentView("home")} className={`comic-btn text-xs md:text-sm ${currentView === "home" ? "bg-[var(--shinchan-yellow)]" : "bg-white"}`}>
              🏠 Beranda
            </button>
            <button onClick={() => setCurrentView("mading")} className={`comic-btn text-xs md:text-sm ${currentView === "mading" ? "bg-[var(--shinchan-yellow)]" : "bg-white"}`}>
              📢 Mading
            </button>
            {currentUser && (
              <button onClick={() => setCurrentView("profile")} className={`comic-btn text-xs md:text-sm ${currentView === "profile" ? "bg-[var(--shinchan-yellow)]" : "bg-white"}`}>
                👤 Profilku
              </button>
            )}
            {currentUser && (
              <button
                onClick={() => setCurrentView("inbox")}
                className={`comic-btn text-xs md:text-sm relative ${currentView === "inbox" ? "bg-[var(--shinchan-yellow)]" : "bg-white"}`}
              >
                💬 Pesan
                {totalUnread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[var(--shinchan-red)] text-white text-[9px] font-black border-2 border-black rounded-full flex items-center justify-center shadow-[1px_1px_0px_#000]">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>
            )}
            {currentUser?.isAdmin && (
              <button onClick={() => setCurrentView("admin")} className="comic-btn comic-btn-accent text-xs md:text-sm text-white">
                <ShieldAlert size={16} />
                Panel Admin
              </button>
            )}
          </nav>

          {/* Auth */}
          <div>
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white p-2 border-3 border-black rounded-xl shadow-[3px_3px_0px_#000]">
                {/* Profile Photo */}
                <div
                  onClick={() => setCurrentView("profile")}
                  className="w-10 h-10 border-2 border-black rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shadow-[1px_1px_0px_#000]"
                  style={{ backgroundColor: currentUser.avatarColor || "var(--pastel-blue)" }}
                >
                  <span className="text-lg font-black">{initial}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    {displayName}
                    {currentUser.isAdmin && (
                      <span className="bg-[var(--shinchan-red)] text-white text-[9px] px-1.5 py-0.5 rounded-full border border-black uppercase font-black">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold">{currentUser.email}</div>
                </div>
                <button onClick={onLogout} className="comic-btn comic-btn-accent p-2 rounded-lg text-white" title="Keluar">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="comic-btn bg-white border-3 border-black text-black font-bold flex items-center gap-2 text-xs md:text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.08-3.08 4.14v3.44h4.97c2.9-2.67 4.58-6.6 4.58-11.43z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.97-3.44c-1.39.93-3.17 1.48-4.99 1.48-3.83 0-7.07-2.58-8.24-6.05H1.03v3.55C3.01 20.9 7.21 24 12 24z" />
                  <path fill="#FBBC05" d="M3.76 13.08a14.38 14.38 0 0 1 0-4.16V5.37H1.03a11.98 11.98 0 0 0 0 11.26l2.73-3.55z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.21 0 3.01 3.1 1.03 7.92l2.73 3.55c1.17-3.47 4.41-6.05 8.24-6.05z" />
                </svg>
                Masuk via Google
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
