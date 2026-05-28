import { useCallback, useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { api, track } from "@/lib/api";

const FREE_LIMIT = 4;

const GREETING = {
  role: "assistant",
  content:
    "Halo, pembaca.\n\nSaya cermin digital dari buku ini. Tanyakan apa yang sedang mengganggu pikiranmu tentang uang, kerja, atau arah hidup.",
};

function TypingDots() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
          style={{ animationDelay: `${d}ms`, animationDuration: "1s" }}
        />
      ))}
    </div>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2.5 text-xs font-body leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-gold text-black"
            : "bg-white/[0.06] border border-white/10 text-ink-primary"
        }`}
      >
        {!isUser && (
          <div className="text-[8px] uppercase tracking-[0.4em] text-gold mb-1">Reflection · AI</div>
        )}
        {content}
      </div>
    </div>
  );
}

export default function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiCount, setAiCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [sessionId] = useState(
    () => `float-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = useCallback(async () => {
    if (locked) return;
    const message = input.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    track("ai_float_send", { len: message.length });
    try {
      const { data } = await api.post("/chat", { session_id: sessionId, message });
      const newCount = aiCount + 1;
      setAiCount(newCount);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (newCount >= FREE_LIMIT) setLocked(true);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Maaf, cermin ini sedang berembun. Coba lagi sebentar." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, aiCount, locked]);

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-[70] w-[calc(100vw-2rem)] max-w-sm bg-bg-secondary border border-white/10 shadow-2xl flex flex-col"
          style={{ height: "420px" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-gold animate-ping opacity-40" />
              </div>
              <span className="font-heading tracking-[0.2em] text-xs text-ink-primary">REFLECTION · AI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-body text-[9px] text-ink-muted">
                {locked ? "Preview habis" : `${FREE_LIMIT - aiCount} gratis tersisa`}
              </span>
              <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-gold transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(197,160,89,0.2) transparent" }}
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <TypingDots />}
            {locked && !loading && (
              <div className="border border-gold/30 bg-gold/5 p-4 text-center space-y-3">
                <Lock size={20} className="text-gold mx-auto" strokeWidth={1.4} />
                <p className="font-body text-xs text-ink-secondary leading-relaxed">
                  Preview habis. Buka full akses untuk AI unlimited.
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="block bg-gold text-black text-xs font-semibold py-2 px-4 hover:bg-gold-hover transition-colors uppercase tracking-wider"
                >
                  Buka Full Book Rp75K →
                </Link>
              </div>
            )}
          </div>

          <div className="px-3 pb-3 pt-2 border-t border-white/10 bg-black/30 flex-shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={locked ? "Preview habis…" : "Tanyakan pada cermin…"}
                disabled={loading || locked}
                className="flex-1 bg-black/50 border border-white/10 focus:border-gold outline-none px-3 py-2.5 text-ink-primary font-body text-xs placeholder:text-ink-muted/60 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || locked}
                className="bg-gold text-black px-3 py-2.5 hover:bg-gold-hover transition-colors disabled:opacity-40"
                aria-label="Kirim"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] flex items-center gap-2 bg-bg-secondary border border-gold gold-glow text-gold px-4 py-3 shadow-2xl hover:bg-gold hover:text-black transition-all font-body text-sm font-semibold"
        aria-label="AI Reflection Assistant"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline">AI Cermin</span>
      </button>
    </>
  );
}
