import React, { useState } from "react";
import { X, Megaphone } from "lucide-react";

/**
 * AnnouncementBanner
 * Tampil di paling atas halaman home, bisa ditutup per-session oleh user.
 * Props:
 *   announcements: array dari Firestore [{ id, text, color, createdAt }]
 */
export default function AnnouncementBanner({ announcements = [] }) {
    // Simpan ID yang sudah ditutup user di session ini
    const [dismissed, setDismissed] = useState([]);

    const visible = announcements.filter(a => !dismissed.includes(a.id));

    if (visible.length === 0) return null;

    return (
        <div className="w-full space-y-0">
            {visible.map((ann) => (
                <div
                    key={ann.id}
                    className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-black"
                    style={{ backgroundColor: ann.color || "#fff79a" }}
                >
                    <Megaphone size={15} className="flex-shrink-0 text-black/70" />
                    <p className="flex-grow text-xs font-extrabold text-gray-900 leading-snug">
                        {ann.text}
                    </p>
                    <button
                        onClick={() => setDismissed(prev => [...prev, ann.id])}
                        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
                        title="Tutup"
                    >
                        <X size={14} className="text-black/60" />
                    </button>
                </div>
            ))}
        </div>
    );
}
