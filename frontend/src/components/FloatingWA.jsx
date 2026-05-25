import { MessageCircle } from "lucide-react";
import { BOOK } from "@/data/content";

export default function FloatingWA() {
  const url = `https://wa.me/${BOOK.whatsapp}?text=${encodeURIComponent(
    "Halo, saya tertarik dengan ebook ELON MUSK × ISLAM."
  )}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      data-testid="floating-wa"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-[#25D366] text-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform font-body text-sm font-semibold"
      aria-label="WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
