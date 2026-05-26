import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api, track } from "@/lib/api";
import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

const SUGGESTIONS = [
  { text: "Kenapa saya selalu merasa kurang, padahal penghasilan sudah naik?", tag: "Bab 8" },
  { text: "Apa yang Elon Musk tahu yang kebanyakan orang tidak?", tag: "Bab 7" },
  { text: "Apa paradoks bayang-bayang itu?", tag: "Bab 1 & 11" },
];

const FREE_LIMIT = 4;

const GREETING = {
  role: "assistant",
  content:
    "Selamat datang, pembaca.\n\nSaya bukan chatbot biasa. Saya cermin — dan cermin hanya memantulkan apa yang ada di depannya.\n\nTanyakan apa yang sedang mengganggu pikiranmu tentang uang, kerja, atau arah hidup.",
};

function TypingDots() {
  return (
    <div className="flex items-center gap-3 text-ink-muted font-body text-sm py-1">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
            style={{ animationDelay: `${d}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
      <span className="text-xs italic text-ink-muted/70">cermin sedang memantulkan…</span>
    </div>
  );
}

function CTAInlineCard() {
  return (
    <div
      data-testid="ai-cta-card"
      className="mt-2 border border-gold/40 bg-gradient-to-br from-gold/5 to-transparent p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
        <span className="font-body text-[10px] uppercase tracking-[0.35em] text-gold">
          Lanjutkan Refleksi
        </span>
      </div>
      <p className="font-quote italic text-base text-ink-primary leading-snug">
        "Percakapan ini baru permukaan. Di Full Book, 11 bab menunggu — dan AI ini hadir tanpa batas."
      </p>
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Link
          to="/checkout"
          data-testid="ai-cta-buy"
          className="flex-1 bg-gold text-black text-xs font-body font-semibold py-3 px-4 text-center hover:bg-gold-hover transition-colors tracking-wider uppercase"
        >
          Ambil Full Book Rp75K →
        </Link>
        <Link
          to="/read/bab-1"
          data-testid="ai-cta-free"
          className="flex-1 border border-white/20 text-ink-secondary text-xs font-body py-3 px-4 text-center hover:border-gold hover:text-gold transition-colors tracking-wider uppercase"
        >
          Baca Bab 1 Gratis
        </Link>
      </div>
    </div>
  );
}

function FreeExhaustedCard() {
  return (
    <div
      data-testid="ai-limit-card"
      className="mt-2 border border-white/20 bg-black/60 backdrop-blur-sm p-6 text-center space-y-4"
    >
      <Lock size={28} className="text-gold mx-auto" strokeWidth={1.4} />
      <h3 className="font-heading text-xl tracking-wide uppercase text-ink-primary">
        Preview Habis
      </h3>
      <p className="font-body text-sm text-ink-secondary leading-relaxed max-w-xs mx-auto">
        Kamu sudah mencecap semesta buku ini. Buka full akses — AI ini unlimited, 11 bab, PDF + EPUB + Flipbook.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          to="/checkout"
          className="bg-gold text-black font-body font-semibold py-3 px-6 hover:bg-gold-hover transition-colors text-sm uppercase tracking-wider"
        >
          Buka Full Book Rp75.000 →
        </Link>
        <Link
          to="/read/bab-1"
          className="border border-white/20 text-ink-secondary font-body py-2.5 px-6 hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-wider"
        >
          Baca Bab 1 Gratis dulu
        </Link>
      </div>
    </div>
  );
}

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        data-testid={isUser ? "ai-msg-user" : "ai-msg-assistant"}
        className={`max-w-[90%] px-4 py-3.5 font-body text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-gold text-black"
            : "bg-white/[0.04] border border-white/10 text-ink-primary"
        }`}
      >
        {!isUser && (
          <div className="text-[9px] uppercase tracking-[0.4em] text-gold mb-2 font-body">
            Reflection · AI
          </div>
        )}
        {content}
      </div>
    </div>
  );
}

export default function AIReflection() {
  const ref = useReveal();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiCount, setAiCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [sessionId] = useState(
    () => `emi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showCTA, locked]);

  const send = useCallback(
    async (text) => {
      if (locked) return;
      const message = (text ?? input).trim();
      if (!message || loading) return;
      setInput("");
      setMessages((m) => [...m, { role: "user", content: message }]);
      setLoading(true);
      track("ai_chat_send", { len: message.length });

      try {
        const { data } = await api.post("/chat", { session_id: sessionId, message });
        const newCount = aiCount + 1;
        setAiCount(newCount);
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        if (newCount >= 2 && !showCTA) setShowCTA(true);
        if (newCount >= FREE_LIMIT) setLocked(true);
      } catch (e) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Maaf, pembaca. Cermin ini sedang berembun. Coba ulangi — atau langsung buka Bab 1 untuk menemui pertanyaannya secara langsung.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, sessionId, aiCount, showCTA, locked]
  );

  return (
    <section
      id="ai"
      data-testid="ai-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.aiBg}
          alt=""
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/88 to-bg-primary" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-16 items-start">

        {/* ── Left: Pitch ─────────────────────────────── */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              AI Reflection Assistant
            </span>
          </div>

          <h2
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            Bukan chatbot.
            <br />
            <span className="text-gold">Cermin digital.</span>
          </h2>

          <div className="border-l-2 border-gold/40 pl-6">
            <p className="font-quote italic text-xl md:text-2xl text-ink-primary/90 leading-snug">
              "Pertanyaan yang tepat sering lebih mahal daripada jawaban nyaman."
            </p>
          </div>

          <p className="font-body text-ink-secondary text-base leading-relaxed">
            Cermin ini hanya berbicara dalam semesta{" "}
            <em className="text-ink-primary not-italic font-medium">Elon Musk × Islam</em>.
            Ia tidak menjawab politik atau gosip. Tugasnya satu:{" "}
            memantulkan hidupmu kembali kepadamu.
          </p>

          <ul className="space-y-3">
            {[
              "Gratis untuk percakapan pertama",
              "Unlimited di Full Book Rp75.000",
              "Konteks buku — bukan AI generik",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 font-body text-sm text-ink-secondary">
                <span className="text-gold text-xs">✦</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {["R", "H", "A", "N"].map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-bg-tertiary border border-white/20 flex items-center justify-center text-[10px] font-heading text-gold"
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-ink-muted">
              <span className="text-ink-secondary font-medium">1.200+ pembaca</span>{" "}
              sudah ngobrol dengan cermin ini
            </p>
          </div>

          {/* CTAs */}
          <div className="pt-2 space-y-3">
            <Link
              to="/checkout"
              data-testid="ai-section-buy"
              className="btn-gold inline-flex items-center justify-center gap-2 w-full"
            >
              ☕ Ambil Full Book Rp75.000
            </Link>
            <Link
              to="/read/bab-1"
              data-testid="ai-section-free"
              className="btn-ghost inline-flex items-center justify-center gap-2 w-full text-sm"
            >
              Baca Bab 1 Gratis dulu
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Right: Chat ──────────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="glass-panel red-glow overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gold animate-ping opacity-40" />
                </div>
                <span className="font-heading tracking-[0.25em] text-sm text-ink-primary">
                  REFLECTION · ONLINE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-[10px] text-ink-muted tracking-wider hidden sm:block">
                  {locked
                    ? "Preview habis"
                    : `${FREE_LIMIT - aiCount} sesi gratis tersisa`}
                </span>
                <Sparkles size={14} className="text-gold" />
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              data-testid="ai-chat-messages"
              className="h-[420px] overflow-y-auto px-5 py-6 space-y-5 scroll-smooth"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(197,160,89,0.2) transparent" }}
            >
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && <TypingDots />}
              {showCTA && !loading && !locked && <CTAInlineCard />}
              {locked && !loading && <FreeExhaustedCard />}
            </div>

            {/* Input */}
            <div className="px-5 pt-3 pb-5 border-t border-white/10 space-y-3 bg-black/30">
              {!locked && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.text)}
                      data-testid={`ai-suggestion-${i}`}
                      disabled={loading || locked}
                      className="group flex items-center gap-1.5 text-xs font-body text-ink-muted border border-white/10 hover:border-gold hover:text-gold px-3 py-1.5 transition-all disabled:opacity-40"
                    >
                      <span className="text-[9px] text-gold/50 group-hover:text-gold tracking-widest uppercase hidden sm:inline">
                        {s.tag}
                      </span>
                      <span className="hidden sm:inline text-ink-muted/70 mx-1">·</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2"
              >
                <input
                  data-testid="ai-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    locked
                      ? "Preview habis — ambil full akses untuk melanjutkan"
                      : "Tanyakan pada cermin…"
                  }
                  disabled={loading || locked}
                  className="flex-1 bg-black/50 border border-white/10 focus:border-gold outline-none px-4 py-3 text-ink-primary font-body text-sm placeholder:text-ink-muted/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {locked ? (
                  <Link
                    to="/checkout"
                    className="bg-gold text-black px-5 py-3 hover:bg-gold-hover transition-colors font-heading tracking-wider text-xs whitespace-nowrap"
                  >
                    Buka Akses
                  </Link>
                ) : (
                  <button
                    type="submit"
                    data-testid="ai-chat-send"
                    disabled={loading || !input.trim()}
                    className="bg-gold text-black px-5 py-3 hover:bg-gold-hover transition-colors disabled:opacity-40 font-heading tracking-wider"
                    aria-label="Kirim"
                  >
                    <Send size={16} />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
