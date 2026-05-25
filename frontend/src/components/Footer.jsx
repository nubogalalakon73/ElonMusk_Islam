import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { BOOK } from "@/data/content";

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative bg-bg-primary border-t border-white/10 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="font-heading text-2xl tracking-[0.2em] text-ink-primary">
            EMI<span className="text-gold">·</span>
          </div>
          <p className="font-body text-sm text-ink-muted leading-relaxed max-w-xs">
            Elon Musk × Islam — sebuah esai hibrida tentang manusia modern,
            uang, dan arah hidup.
          </p>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-muted pt-3">
            © {new Date().getFullYear()} {BOOK.author}
          </p>
        </div>

        <div className="space-y-3">
          <div className="font-heading text-sm tracking-[0.3em] uppercase text-gold">
            Kontak
          </div>
          <a
            href={`mailto:${BOOK.email}`}
            data-testid="footer-email"
            className="block font-body text-sm text-ink-secondary hover:text-gold transition-colors"
          >
            {BOOK.email}
          </a>
          <a
            href={`https://wa.me/${BOOK.whatsapp}`}
            target="_blank"
            rel="noreferrer noopener"
            data-testid="footer-wa"
            className="block font-body text-sm text-ink-secondary hover:text-gold transition-colors"
          >
            WhatsApp · {BOOK.whatsappDisplay}
          </a>
        </div>

        <div className="space-y-3">
          <div className="font-heading text-sm tracking-[0.3em] uppercase text-gold">
            Ikuti
          </div>
          <div className="flex gap-4">
            {[
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Twitter, href: "#", label: "X" },
              { Icon: Youtube, href: "#", label: "YouTube" },
              { Icon: Mail, href: `mailto:${BOOK.email}`, label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-ink-secondary hover:text-gold transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
