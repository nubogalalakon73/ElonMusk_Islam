import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { greeting, intentOf, respond, INITIAL_QUICK_REPLIES } from "@/lib/chatBot";
import { API, track } from "@/lib/api";

export default function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState(INITIAL_QUICK_REPLIES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [sessionId, setSessionId] = useState(() => {
    try { return localStorage.getItem("emi_chat_sid") || ""; } catch { return ""; }
  });
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const persistSession = (sid) => {
    if (!sid) return;
    setSessionId(sid);
    try { localStorage.setItem("emi_chat_sid", sid); } catch {}
  };

  const handleAction = useCallback((action) => {
    if (action.type === "navigate-bab1") {
      setTimeout(() => { setOpen(false); navigate("/read/bab-1"); }, 700);
    } else if (action.type === "navigate-checkout") {
      setTimeout(() => { setOpen(false); navigate("/checkout"); }, 700);
    } else if (action.type === "open-wa" && action.url) {
      setTimeout(() => { window.open(action.url, "_blank", "noopener"); }, 500);
    }
  }, [navigate]);

  const sendBot = useCallback((resp) => {
    setTyping(true);
    setQuickReplies([]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: resp.text }]);
      setQuickReplies(resp.quickReplies || []);
      setTyping(false);
      if (resp.action) handleAction(resp.action);
    }, 700 + Math.min(resp.text.length * 5, 800));
  }, [handleAction]);

  const callLlm = useCallback(async (text, currentMessages) => {
    setTyping(true);
    setQuickReplies([]);
    try {
      const history = currentMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        text: m.text,
      }));
      const { data } = await axios.post(
        `${API}/chat`,
        { session_id: sessionId || undefined, message: text, history },
        { timeout: 45000 }
      );
      persistSession(data.session_id);
      setMessages((m) => [...m, { role: "bot", text: data.reply || data.response }]);
      setQuickReplies(INITIAL_QUICK_REPLIES);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Maaf, koneksi sedang lambat. Coba lagi atau gunakan tombol di bawah." },
      ]);
      setQuickReplies(INITIAL_QUICK_REPLIES);
    } finally {
      setTyping(false);
    }
  }, [sessionId]);

  const FAST_INTENTS = new Set([
    "bab1", "open-bab1", "harga", "beli", "wa", "elon", "islam",
    "tentang", "menu", "salam", "terimakasih", "download-error", "download-wa",
  ]);

  const userSay = useCallback((text) => {
    if (!text.trim()) return;
    const newMsg = { role: "user", text };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput("");
    track("ai_float_send", { len: text.length });
    const intent = intentOf(text);
    if (FAST_INTENTS.has(intent)) {
      sendBot(respond(intent));
    } else {
      callLlm(text, newMessages.slice(0, -1));
    }
  }, [messages, sendBot, callLlm]);

  const handleIntent = useCallback((intent) => {
    const qr = quickReplies.find((q) => q.intent === intent);
    if (qr) setMessages((m) => [...m, { role: "user", text: qr.label }]);
    track(`ai_intent_${intent}`, {});
    sendBot(respond(intent));
  }, [quickReplies, sendBot]);

  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true);
      setTyping(true);
      const t = setTimeout(() => {
        const g = greeting();
        setMessages([{ role: "bot", text: g.text }]);
        setQuickReplies(g.quickReplies);
        setTyping(false);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [open, hasGreeted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 999;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setPulse(true), 12_000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setPulse(false); track("ai_float_open", {}); }}
          aria-label="Buka AI Assistant"
          className="fixed bottom-6 right-5 z-50 group"
        >
          <div className={`relative w-16 h-16 rounded-full bg-bg-secondary border border-gold gold-glow grid place-items-center shadow-2xl transition-transform hover:scale-105 ${pulse ? "animate-pulse" : ""}`}>
            <Sparkles className="w-7 h-7 text-gold" strokeWidth={1.7} />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-bg-primary" />
          </div>
          <span className="hidden md:block absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-body text-ink-primary bg-bg-secondary border border-white/10 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition">
            AI Assistant · Online
          </span>
        </button>
      )}

      {open && (
        <div className="fixed z-50 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[400px] sm:max-w-[92vw] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] flex flex-col bg-bg-primary border border-white/10 shadow-2xl sm:rounded-xl overflow-hidden">

          <div className="relative px-5 py-4 flex items-center gap-3 border-b border-white/10 bg-bg-secondary flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border border-gold gold-glow grid place-items-center bg-black/40">
                <Sparkles className="w-5 h-5 text-gold" strokeWidth={1.7} />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-bg-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-heading text-ink-primary font-semibold leading-tight text-sm tracking-wide">
                AI Reflection Assistant
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
                Elon Musk × Islam · Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-gold p-2 transition-colors" aria-label="Tutup">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(197,160,89,0.15) transparent" }}>
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[88%] ${m.role === "user" ? "ml-auto" : ""}`}>
                <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line font-body ${m.role === "user" ? "bg-gold text-black rounded-2xl rounded-br-sm" : "bg-white/[0.04] border border-white/10 text-ink-primary rounded-2xl rounded-bl-sm"}`}>
                  {m.role === "bot" && (
                    <div className="text-[9px] uppercase tracking-[0.35em] text-gold mb-1.5">Reflection · AI</div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="max-w-[60%]">
                <div className="px-4 py-3 inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-2xl rounded-bl-sm">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${d}ms`, animationDuration: "1s" }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {quickReplies.length > 0 && (
            <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2 flex-shrink-0">
              {quickReplies.map((q) => (
                <button key={q.id} onClick={() => handleIntent(q.intent)} className="text-xs px-3 py-2 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all rounded-full font-body font-medium">
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); userSay(input); }} className="px-4 py-3 border-t border-white/10 flex items-center gap-2 bg-black/20 flex-shrink-0">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa saja tentang buku…"
              className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2.5 text-sm font-body text-ink-primary placeholder:text-ink-muted/50 focus:border-gold focus:outline-none transition-colors"
            />
            <button type="submit" disabled={!input.trim() || typing} className="w-10 h-10 grid place-items-center rounded-full bg-gold text-black hover:bg-gold/80 transition-colors disabled:opacity-40">
              {typing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pb-2 text-[9px] font-body text-ink-muted/30 uppercase tracking-widest">
            Powered by AI Reflection Engine
          </div>
        </div>
      )}
    </>
  );
}
