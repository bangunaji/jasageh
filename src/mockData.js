export const REGIONS = [
  "Kota Bandar Lampung",
  "Kota Metro",
  "Kabupaten Lampung Selatan",
  "Kabupaten Lampung Tengah",
  "Kabupaten Lampung Timur",
  "Kabupaten Lampung Utara",
  "Kabupaten Lampung Barat",
  "Kabupaten Tulang Bawang",
  "Kabupaten Tulang Bawang Barat",
  "Kabupaten Tanggamus",
  "Kabupaten Pesawaran",
  "Kabupaten Pringsewu",
  "Kabupaten Mesuji",
  "Kabupaten Way Kanan",
  "Kabupaten Pesisir Barat"
];

export const CATEGORIES = [
  "Rumah Tangga & Kebersihan",
  "Pendidikan & Les",
  "Transportasi & Kurir",
  "Reparasi & Teknik",
  "Kreatif & Desain",
  "Kuliner & Katering",
  "Sosial & Hiburan",
  "Lainnya"
];

export const DEFAULT_USERS = [
  {
    id: "user-shinchan",
    name: "Shinnosuke Nohara (Shin-chan)",
    email: "shinchan@gmail.com",
    role: "provider", // provider = pembuat jasa (bisa menawarkan jasa)
    avatar: "🎒",
    whatsapp: "6281234567890",
    region: "Kota Bandar Lampung",
    bio: "Penyuka Chocobi nomor satu di dunia! Suka menari tarian perut, mengajak Shiro jalan-jalan (kadang lupa), dan mengusili Kazama. Bisa menyanyi lagu gajah!",
    views: 185,
    categories: ["Sosial & Hiburan", "Lainnya"],
    ratings: [
      {
        id: "r1",
        raterId: "user-kazama",
        raterName: "Toru Kazama",
        stars: 4,
        comment: "Jasanya menghibur sih saat pesta ulang tahunku, tapi dia malah meniru gaya pahlawan bertopeng dan merusak dekorasi!",
        date: "2026-06-01"
      },
      {
        id: "r2",
        raterId: "user-misae",
        raterName: "Misae Nohara",
        stars: 2,
        comment: "Dia bilang mau bantu bersihin rumah, tapi malah tidur siang di ruang tamu dan menghabiskan stok snack Chocobi!",
        date: "2026-06-02"
      }
    ]
  },
  {
    id: "user-kazama",
    name: "Toru Kazama",
    email: "kazama@gmail.com",
    role: "receiver", // receiver = penerima jasa (bisa mencari jasa)
    avatar: "👔",
    whatsapp: "6289876543210",
    region: "Kota Bandar Lampung",
    bio: "Anak teladan yang gemar belajar bahasa Inggris dan bercita-cita menjadi elit global. Menyukai hal-rich dan elit (tapi diam-diam ngefans Moe-P). Butuh jasa profesional.",
    views: 92,
    categories: ["Pendidikan & Les", "Transportasi & Kurir"],
    ratings: [
      {
        id: "r3",
        raterId: "user-shinchan",
        raterName: "Shinnosuke Nohara",
        stars: 5,
        comment: "Kazama-kun sangat baik! Selalu memberi kue yang enak setiap kali aku main ke rumahnya. Hehehe...",
        date: "2026-06-03"
      }
    ]
  },
  {
    id: "user-hiroshi",
    name: "Hiroshi Nohara",
    email: "hiroshi@gmail.com",
    role: "provider",
    avatar: "💼",
    whatsapp: "6281122334455",
    region: "Kabupaten Lampung Selatan",
    bio: "Kepala bagian di perusahaan swasta dengan cicilan rumah 32 tahun tersisa. Punya keahlian memotong rumput, mencuci mobil, dan memiliki bau kaki legendaris yang bisa melumpuhkan musuh.",
    views: 120,
    categories: ["Rumah Tangga & Kebersihan", "Reparasi & Teknik"],
    ratings: [
      {
        id: "r4",
        raterId: "user-misae",
        raterName: "Misae Nohara",
        stars: 5,
        comment: "Kerja bagus memotong rumput halaman belakang, meskipun pulangnya agak telat karena mampir minum bir.",
        date: "2026-05-28"
      }
    ]
  },
  {
    id: "user-misae",
    name: "Misae Nohara (Admin)",
    email: "misae@gmail.com",
    role: "admin", // admin dashboard access
    avatar: "👩",
    whatsapp: "6285566778899",
    region: "Kota Bandar Lampung",
    bio: "Ibu rumah tangga super sibuk yang mengelola keuangan keluarga Nohara. Ahli dalam mendisiplinkan anak nakal dengan 'jurus tonjokan cinta' dan 'jurus memutarkan pelipis'.",
    views: 310,
    categories: ["Rumah Tangga & Kebersihan"],
    ratings: []
  },
  {
    id: "user-masao",
    name: "Masao Sato",
    email: "masao@gmail.com",
    role: "receiver",
    avatar: "🍙",
    whatsapp: "6281223344667",
    region: "Kabupaten Lampung Tengah",
    bio: "Anak berkepala bulat mirip nasi kepal (onigiri). Sangat penakut, sering menangis, tapi sangat rapi dan suka bersih-bersih. Butuh perlindungan atau teman bermain.",
    views: 45,
    categories: ["Sosial & Hiburan", "Rumah Tangga & Kebersihan"],
    ratings: []
  },
  {
    id: "user-nene",
    name: "Nene Sakurada",
    email: "nene@gmail.com",
    role: "provider",
    avatar: "👧",
    whatsapp: "6281223344889",
    region: "Kota Metro",
    bio: "Gadis manis yang menyukai drama romantis rumit melalui permainan 'Rumah-rumahan Realistis'. Memiliki boneka kelinci kesayangan yang sering dipukul jika sedang kesal.",
    views: 78,
    categories: ["Sosial & Hiburan"],
    ratings: [
      {
        id: "r5",
        raterId: "user-masao",
        raterName: "Masao Sato",
        stars: 3,
        comment: "Nene-chan memaksa aku menjadi suami yang menganggur dan tertindas di game rumah-rumahan lagi... tapi seru sih.",
        date: "2026-06-02"
      }
    ]
  },
  {
    id: "user-bochan",
    name: "Bo-chan",
    email: "bochan@gmail.com",
    role: "provider",
    avatar: "🗿",
    whatsapp: "6281223344990",
    region: "Kabupaten Pringsewu",
    bio: "Anak misterius yang pendiam tapi jenius. Sangat menyukai batu unik dengan berbagai bentuk dan selalu memiliki cairan hidung (ingus) yang bisa dimainkan seperti lasso.",
    views: 112,
    categories: ["Lainnya", "Pendidikan & Les"],
    ratings: [
      {
        id: "r6",
        raterId: "user-shinchan",
        raterName: "Shinnosuke Nohara",
        stars: 5,
        comment: "Bo-chan menunjukkan batu berbentuk hati yang sangat keren! Bo-chan memang yang terbaik!",
        date: "2026-06-03"
      }
    ]
  }
];

export const DEFAULT_POSTS = [
  {
    id: "post-1",
    userId: "user-shinchan",
    userName: "Shinnosuke Nohara (Shin-chan)",
    userAvatar: "🎒",
    title: "Jasa Menemani Bermain & Makan Chocobi Bersama",
    description: "Halo kakak-kakak cantik! Aku Shin-chan, siap menemani kakak-kakak mengobrol, menari tarian perut, atau menggambar pahlawan bertopeng. Syaratnya: kakak harus membelikanku Chocobi rasa cokelat ya! Hehehe... Oh iya, aku tidak suka wortel dan bawang bombay ya!",
    type: "offer", // offer = tawarkan jasa (dari pembuat jasa)
    category: "Sosial & Hiburan",
    region: "Kota Bandar Lampung",
    whatsapp: "6281234567890",
    createdAt: "2026-06-03T10:00:00.000Z",
    comments: [
      {
        id: "c1",
        userId: "user-kazama",
        userName: "Toru Kazama",
        userAvatar: "👔",
        content: "Siapa juga yang mau membayar anak nakal sepertimu hanya untuk makan snack?! Jangan membuat postingan aneh-aneh di sini!",
        createdAt: "2026-06-03T10:15:00.000Z"
      },
      {
        id: "c2",
        userId: "user-misae",
        userName: "Misae Nohara (Admin)",
        userAvatar: "👩",
        content: "SHIN-CHAN! Cepat pulang dan rapikan mainanmu! Jangan main HP terus!",
        createdAt: "2026-06-03T11:00:00.000Z"
      }
    ]
  },
  {
    id: "post-2",
    userId: "user-kazama",
    userName: "Toru Kazama",
    userAvatar: "👔",
    title: "Mencari Tutor Bahasa Inggris / Guru Les Privat Elit",
    description: "Saya mencari guru privat bahasa Inggris yang berpengalaman untuk persiapan ujian masuk sekolah internasional. Harus menguasai grammar dengan baik, memiliki aksen British yang kental, ramah, dan tidak berisik. Lokasi les di rumah saya di area Bandar Lampung.",
    type: "need", // need = cari jasa (dari penerima jasa)
    category: "Pendidikan & Les",
    region: "Kota Bandar Lampung",
    whatsapp: "6289876543210",
    createdAt: "2026-06-02T14:00:00.000Z",
    comments: [
      {
        id: "c3",
        userId: "user-shinchan",
        userName: "Shinnosuke Nohara",
        userAvatar: "🎒",
        content: "Kazama-kun, aku bisa mengeja 'elephant' loh! G-A-J-A-H... Hehehe, mau aku ajari?",
        createdAt: "2026-06-02T14:30:00.000Z"
      },
      {
        id: "c4",
        userId: "user-kazama",
        userName: "Toru Kazama",
        userAvatar: "👔",
        content: "Itu bahasa Indonesia, Shin-chan! Dan ejaannya salah untuk bahasa Inggris!",
        createdAt: "2026-06-02T14:35:00.000Z"
      }
    ]
  },
  {
    id: "post-3",
    userId: "user-hiroshi",
    userName: "Hiroshi Nohara",
    userAvatar: "💼",
    title: "Jasa Potong Rumput & Perapian Halaman Rumah",
    description: "Menerima jasa merapikan taman, memotong rumput liar, serta menyiram tanaman di akhir pekan (Sabtu & Minggu). Punya alat pemotong rumput sendiri. Hasil kerja rapi, cepat, dan dijamin memuaskan demi mencicil rumah selama 32 tahun lagi. Melayani area Kalianda dan sekitarnya.",
    type: "offer",
    category: "Rumah Tangga & Kebersihan",
    region: "Kabupaten Lampung Selatan",
    whatsapp: "6281122334455",
    createdAt: "2026-06-01T08:00:00.000Z",
    comments: [
      {
        id: "c5",
        userId: "user-misae",
        userName: "Misae Nohara (Admin)",
        userAvatar: "👩",
        content: "Bagus, Papa. Uang jasanya nanti langsung serahkan ke Mama untuk ditabung ya. Jangan buat beli bir!",
        createdAt: "2026-06-01T09:12:00.000Z"
      }
    ]
  },
  {
    id: "post-4",
    userId: "user-masao",
    userName: "Masao Sato",
    userAvatar: "🍙",
    title: "Butuh Teman Belanja ke Pasar (Takut Ibu-Ibu Galak)",
    description: "Ibu memintaku membeli sayuran dan cabai di pasar Lampung Tengah, tapi di sana sangat ramai dan aku takut tersesat atau dimarahi penjual yang galak. Adakah kakak-kakak baik yang bersedia menemani dan melindungiku saat berbelanja? Nanti aku traktir es krim cup!",
    type: "need",
    category: "Sosial & Hiburan",
    region: "Kabupaten Lampung Tengah",
    whatsapp: "6281223344667",
    createdAt: "2026-06-03T16:00:00.000Z",
    comments: [
      {
        id: "c6",
        userId: "user-nene",
        userName: "Nene Sakurada",
        userAvatar: "👧",
        content: "Aku mau menemani, Masao! Tapi setelah itu kita harus main rumah-rumahan realistis ya. Kamu jadi bapak rumah tangga yang kehilangan pekerjaannya!",
        createdAt: "2026-06-03T16:15:00.000Z"
      },
      {
        id: "c7",
        userId: "user-masao",
        userName: "Masao Sato",
        userAvatar: "🍙",
        content: "Aduh... sepertinya ke pasar sendiri lebih aman...",
        createdAt: "2026-06-03T16:22:00.000Z"
      }
    ]
  },
  {
    id: "post-5",
    userId: "user-bochan",
    userName: "Bo-chan",
    userAvatar: "🗿",
    title: "Jasa Kurator Batu & Dekorasi Taman Minimalis",
    description: "Saya menyediakan jasa memilihkan batu hias terbaik untuk kolam ikan atau halaman rumah Anda. Saya memiliki koleksi batu unik dari Pringsewu. Saya juga bisa membantu menyusunnya agar terlihat artistik dan bernilai seni tinggi. Hubungi jika berminat.",
    type: "offer",
    category: "Rumah Tangga & Kebersihan",
    region: "Kabupaten Pringsewu",
    whatsapp: "6281223344990",
    createdAt: "2026-05-30T10:00:00.000Z",
    comments: []
  }
];

export const DEFAULT_MADING = [
  {
    id: "mad-1",
    userId: "user-misae",
    userName: "Misae Nohara",
    userAvatar: "👩",
    content: "📢 PENGUMUMAN PENTING: Ditemukan seekor anjing putih berbulu lebat mirip kapas di sekitar Jl. Kartini Bandar Lampung. Anjing tersebut sangat penurut dan pintar (bisa menggulung diri jadi bola). Bagi yang merasa kehilangan, silakan hubungi saya. Sementara anjing kami beri nama Shiro!",
    color: "#ffb3ba", // pastel coral
    createdAt: "2026-06-04T09:00:00.000Z",
    reactions: { shiro: 12, shinchan: 5, actionMask: 4 }
  },
  {
    id: "mad-2",
    userId: "user-shinchan",
    userName: "Shinnosuke Nohara (Shin-chan)",
    userAvatar: "🎒",
    content: "Oi! Hari ini film Pahlawan Bertopeng (Action Mask) tayang jam 5 sore nanti sore ya! Jangan sampai kelewatan! Ayo kita nonton sambil bergaya 'Waa-ha-ha-ha!' 🦸‍♂️✨",
    color: "#bae1ff", // pastel blue
    createdAt: "2026-06-04T07:30:00.000Z",
    reactions: { shiro: 3, shinchan: 22, actionMask: 18 }
  },
  {
    id: "mad-3",
    userId: "user-bochan",
    userName: "Bo-chan",
    userAvatar: "🗿",
    content: "Pameran Batu Akik Lampung dan Batu Langka di Pringsewu akan diadakan akhir pekan ini. Masuk gratis. Saya akan memamerkan batu koleksi saya yang mirip wajah Kepala Sekolah. Datang ya...",
    color: "#c4df9b", // chocobi green
    createdAt: "2026-06-03T15:00:00.000Z",
    reactions: { shiro: 8, shinchan: 9, actionMask: 2 }
  }
];
