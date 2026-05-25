import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { api, track } from "@/lib/api";
import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

const SUGGESTIONS = [
  "Kenapa saya selalu merasa kurang uang?",
  "Bagaimana cara menciptakan nilai, bukan mengejarnya?",
  "Apa maksud paradoks bayang-bayang?",
];

const GREETING = {
  role: "assistant",
  content:
    "Selamat datang, pembaca. Saya bukan chatbot biasa — saya cermin digital untuk membaca ulang hidupmu lewat semesta buku ini.\n\nSilakan tanyakan apa pun yang sedang mengganggu pikiranmu tentang uang, kerja, atau arah hidup.",
};

export default function AIReflection() {
  const ref = useReveal();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(
    () => `emi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    track("ai_chat_send", { len: message.length });
    try {
      const { data } = await api.post("/chat", { session_id: sessionId, message });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Maaf, pembaca. Cermin ini sedang berembun. Coba ulangi sebentar lagi — atau buka langsung halaman Bab 1 untuk menemui pertanyaannya secara langsung.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="ai"
      data-testid="ai-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0">
        <img src={IMAGES.aiBg} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/85 to-bg-primary" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
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
          <p className="font-quote italic text-2xl text-ink-primary leading-snug max-w-md">
            "Pertanyaan yang tepat sering lebih mahal daripada jawaban nyaman."
          </p>
          <p className="font-body text-ink-secondary text-base leading-relaxed max-w-md">
            Asisten ini hanya berbicara dalam semesta buku <em className="text-ink-primary">Elon Musk × Islam</em>.
            Ia tidak menjawab politik, koding, atau gosip selebriti. Tugasnya satu:
            memantulkan hidupmu kembali kepadamu.
          </p>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-7">
          <div className="glass-panel red-glow rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-heading tracking-[0.25em] text-sm text-ink-primary">
                  REFLECTION · ONLINE
                </span>
              </div>
              <Sparkles size={16} className="text-gold" />
            </div>

            <div
              ref={scrollRef}
              data-testid="ai-chat-messages"
              className="h-[420px] overflow-y-auto px-5 py-6 space-y-5"
            >
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-ink-muted font-body text-sm">
                  <Loader2 size={16} className="animate-spin text-gold" />
                  <span>cermin sedang memantulkan…</span>
                </div>
              )}
            </div>

            <div className="px-5 pt-3 pb-5 border-t border-white/10 space-y-3">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    data-testid={`ai-suggestion-${i}`}
                    disabled={loading}
                    className="text-xs font-body text-ink-secondary border border-white/10 hover:border-gold hover:text-gold px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

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
                  placeholder="Tanyakan pada cermin…"
                  className="flex-1 bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 text-ink-primary font-body text-sm placeholder:text-ink-muted"
                  disabled={loading}
                />
                <button
                  type="submit"
                  data-testid="ai-chat-send"
                  disabled={loading || !input.trim()}
                  className="bg-gold text-black px-4 py-3 hover:bg-ink-primary transition-colors disabled:opacity-50"
                  aria-label="Kirim"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        data-testid={isUser ? "ai-msg-user" : "ai-msg-assistant"}
        className={`max-w-[88%] px-4 py-3 font-body text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-gold text-black"
            : "bg-black/50 border border-white/10 text-ink-primary"
        }`}
      >
        {!isUser && (
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1.5">
            Reflection
          </div>
        )}
        {content}
      </div>
    </div>
  );
}
