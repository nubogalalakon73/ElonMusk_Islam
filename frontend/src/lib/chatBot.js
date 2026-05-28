// Rule-based chatbot for "AI Reflection Assistant — Elon Musk × Islam"
// Scripted intent matching + quick-reply flows, conversion-focused.

const BOOK_WA = "6289985533333";

export const WA_LINK = (msg) =>
  `https://wa.me/${BOOK_WA}?text=${encodeURIComponent(msg)}`;

const GREETING_TEXT =
  "Selamat datang, pembaca.\n\nSaya AI Reflection Assistant dari buku *Elon Musk × Islam*. Saya bisa bantu Anda eksplorasi buku ini atau langsung arahkan ke akses full.";

export const INITIAL_QUICK_REPLIES = [
  { id: "qr-bab1",  label: "📖 Baca Bab 1 Gratis", intent: "bab1"    },
  { id: "qr-isi",   label: "💡 Tentang Buku",        intent: "tentang" },
  { id: "qr-harga", label: "💳 Harga & Beli",         intent: "harga"   },
  { id: "qr-wa",    label: "📲 WhatsApp Admin",        intent: "wa"      },
];

export const greeting = () => ({
  text: GREETING_TEXT,
  quickReplies: INITIAL_QUICK_REPLIES,
});

const QR_BACK = { id: "back", label: "↩ Menu utama", intent: "menu" };

const QR_AFTER_HARGA = [
  { id: "beli-now",  label: "🔥 Beli Sekarang Rp75K", intent: "beli" },
  { id: "bab1-free", label: "📖 Coba Bab 1 Gratis",   intent: "bab1" },
  QR_BACK,
];

const BAB_LIST = [
  "BAB 1 — Pertanyaan yang Elon Musk Tidak Berani Jawab",
  "BAB 2 — Jalan Sunyi Menuju Mekkah",
  "BAB 3 — Antara Silicon Valley dan Madinah",
  "BAB 4 — Kecerdasan Buatan dan Wahyu Terakhir",
  "BAB 5 — Paradoks Manusia Modern",
  "BAB 6 — Ketika Teknologi Bertemu Iman",
  "BAB 7 — Islam dan Masa Depan Peradaban",
  "BAB 8 — Cermin yang Tidak Bisa Dibuang",
  "BAB 9 — Jalan Pulang",
  "BAB 10 — Pertanyaan yang Tersisa",
  "BAB 11 — Akhir yang Bukan Akhir",
];

function detectIntent(textRaw) {
  const t = (textRaw || "").toLowerCase();
  if (!t.trim()) return "fallback";
  if (/(bab 1|bab1|preview|gratis|free|sample|baca dulu|coba dulu)/.test(t)) return "bab1";
  if (/(harga|biaya|beli|berapa|tarif|price|murah|mahal|diskon|promo)/.test(t)) return "harga";
  if (/(isi|tentang|apa itu|sinopsis|materi|bab|konten|topik|bahas)/.test(t)) return "tentang";
  if (/(whatsapp|admin|wa|manusia|cs|hubungi|kontak|tanya admin)/.test(t)) return "wa";
  if (/(beli|bayar|checkout|order|beli sekarang|ambil)/.test(t)) return "beli";
  if (/(elon musk|tesla|spacex|twitter|x\.com)/.test(t)) return "elon";
  if (/(islam|muslim|quran|sholat|iman|hijrah|dakwah)/.test(t)) return "islam";
  if (/(terima kasih|makasih|thx|thanks|oke|ok|mantap|keren)/.test(t)) return "terimakasih";
  if (/(halo|hai|hi|hello|assalamualaikum|pagi|siang|sore|malam)/.test(t)) return "salam";
  if (/(gagal.*(download|unduh)|tidak.*(bisa|dapat).*(file|pdf|epub)|link.*(mati|error)|belum.*terima.*file|resend|kirim.ulang)/.test(t)) return "download-error";
  return "fallback";
}

export function respond(intent) {
  switch (intent) {
    case "salam":
      return {
        text: "Halo 👋 Saya AI Reflection Assistant buku *Elon Musk × Islam*. Pilih salah satu di bawah — saya siap memandu.",
        quickReplies: INITIAL_QUICK_REPLIES,
      };
    case "menu":
      return { text: "Ada yang bisa saya bantu selanjutnya?", quickReplies: INITIAL_QUICK_REPLIES };
    case "bab1":
      return {
        text: "Bab 1 — *\"Pertanyaan yang Elon Musk Tidak Berani Jawab\"* — bisa dibaca gratis, langsung di browser. Estimasi 12 menit baca.\n\nSaya arahkan sekarang.",
        quickReplies: [
          { id: "open-bab1", label: "🚀 Buka Bab 1 Sekarang", intent: "open-bab1" },
          { id: "go-harga",  label: "💳 Langsung Full Book",   intent: "harga"     },
          QR_BACK,
        ],
        action: { type: "navigate-bab1" },
      };
    case "open-bab1":
      return {
        text: "Membuka halaman Bab 1…",
        quickReplies: INITIAL_QUICK_REPLIES,
        action: { type: "navigate-bab1" },
      };
    case "tentang":
      return {
        text:
          "*Elon Musk × Islam* bukan buku biasa.\n\nIa pertanyaan 441 halaman tentang manusia, uang, teknologi, dan arah hidup — ditulis dalam kerangka cermin, bukan dakwah.\n\nIsi 11 bab:\n" +
          BAB_LIST.map((b, i) => `${i === 0 ? "🔓" : "🔒"} ${b}`).join("\n"),
        quickReplies: [
          { id: "qr-bab1",  label: "📖 Baca Bab 1 Gratis", intent: "bab1"  },
          { id: "qr-harga", label: "💳 Lihat Harga",         intent: "harga" },
          QR_BACK,
        ],
      };
    case "harga":
      return {
        text: "Satu paket, satu harga:\n\n🔥 *Full Book — Rp 75.000*\n✓ 11 Bab lengkap\n✓ PDF Premium + EPUB Mobile + Flipbook Interaktif\n✓ AI Reflection Assistant unlimited\n✓ Akses selamanya, sekali bayar\n\nBab 1 tetap gratis tanpa syarat.",
        quickReplies: QR_AFTER_HARGA,
      };
    case "beli":
      return {
        text: "Siap! Membuka halaman checkout sekarang. Pembayaran aman via Midtrans — QRIS, GoPay, transfer bank, semua bisa.",
        quickReplies: INITIAL_QUICK_REPLIES,
        action: { type: "navigate-checkout" },
      };
    case "elon":
      return {
        text: "Elon Musk muncul di buku ini bukan sebagai tokoh utama — melainkan sebagai cermin.\n\nPertanyaan di balik namanya: kenapa seseorang yang punya segalanya masih terus mencari? Bab 1 membuka percakapan ini secara gratis.",
        quickReplies: [
          { id: "qr-bab1",  label: "📖 Baca Bab 1 Gratis", intent: "bab1"  },
          { id: "qr-harga", label: "💳 Full Book Rp75K",    intent: "harga" },
          QR_BACK,
        ],
      };
    case "islam":
      return {
        text: "Buku ini tidak menghakimi — ia mempertanyakan.\n\nIslam hadir bukan sebagai jawaban final, tapi sebagai kerangka untuk melihat ulang pilihan hidup modern.",
        quickReplies: [
          { id: "qr-bab1",  label: "📖 Mulai dari Bab 1", intent: "bab1"  },
          { id: "qr-harga", label: "💳 Full Book Rp75K",   intent: "harga" },
          QR_BACK,
        ],
      };
    case "wa":
      return {
        text: "Membuka WhatsApp Admin sekarang. Nomor: 0899-855-3333.",
        quickReplies: INITIAL_QUICK_REPLIES,
        action: { type: "open-wa", url: WA_LINK("Halo Admin, saya ingin tanya tentang buku Elon Musk × Islam.") },
      };
    case "download-error":
      return {
        text: "Mohon maaf ada kendala download 🙏\n\nHubungi Admin WhatsApp dengan Order ID Anda — file dikirim ulang dalam 5–10 menit.",
        quickReplies: [
          { id: "dl-wa", label: "💬 Hubungi Admin WA", intent: "download-wa" },
          QR_BACK,
        ],
      };
    case "download-wa":
      return {
        text: "Membuka WhatsApp Admin…",
        quickReplies: INITIAL_QUICK_REPLIES,
        action: { type: "open-wa", url: WA_LINK("Halo Admin, saya gagal download file setelah bayar buku Elon Musk × Islam. Mohon bantuannya.") },
      };
    case "terimakasih":
      return {
        text: "Sama-sama 🙏 Semoga buku ini memberikan perspektif baru.",
        quickReplies: INITIAL_QUICK_REPLIES,
      };
    case "fallback":
    default:
      return {
        text: "Saya belum menangkap maksud pertanyaan Anda. Mungkin salah satu pilihan ini bisa membantu?",
        quickReplies: INITIAL_QUICK_REPLIES,
      };
  }
}

export function intentOf(text) {
  return detectIntent(text);
}
