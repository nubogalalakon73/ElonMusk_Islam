import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#paradox", label: "Paradoks" },
  { href: "#elon", label: "Elon" },
  { href: "#auf", label: "Bin Auf" },
  { href: "#ai", label: "AI" },
  { href: "#chapters", label: "Bab" },
  { href: "#pricing", label: "Harga" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <span className="font-heading text-xl tracking-[0.2em] text-ink-primary group-hover:text-gold transition-colors">
            EMI<span className="text-gold">·</span>
          </span>
          <span className="hidden md:block text-xs font-body uppercase tracking-[0.3em] text-ink-muted">
            Elon Musk × Islam
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className="text-xs font-body uppercase tracking-[0.25em] text-ink-secondary hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link to="/checkout" data-testid="nav-cta-buy" className="btn-gold !py-2 !px-5 !text-sm">
            Ambil Buku
          </Link>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-ink-primary p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-panel border-t border-white/10 px-6 py-6 space-y-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-body uppercase tracking-[0.25em] text-ink-secondary hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            data-testid="nav-mobile-cta-buy"
            className="btn-gold w-full"
          >
            Ambil Buku Rp75K
          </Link>
        </div>
      )}
    </nav>
  );
}
