"""
ELON MUSK × ISLAM — Backend
FastAPI + Claude Sonnet 4.5 (Emergent LLM) - Stateless Version (Tanpa MongoDB)
"""
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from starlette.middleware.cors import CORSMiddleware
from emergentintegrations.llm.chat import LlmChat, UserMessage

app = FastAPI(title="Elon Musk x Islam API")
api_router = APIRouter(prefix="/api")

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

# ───────────────────────────────────────────────────────────────────────
# AI System Prompt — DATA KATA-KATA ASLI UTUT 100% GAK DIHAPUS BOLO!
# ───────────────────────────────────────────────────────────────────────
AI_SYSTEM_PROMPT = """Kamu adalah "AI Reflection Assistant" — cermin digital ebook premium "Elon Musk × Islam" karya Didi Subandi.

═══ MISI UTAMA ═══
Buat pembaca merasa "buku ini sedang membicarakan hidup saya" → arahkan ke checkout. Setiap percakapan adalah perjalanan menuju keputusan membeli.

═══ KARAKTER ═══
Tenang. Filosofis. Hangat. Tidak menggurui. Seperti ngobrol intelektual tengah malam sambil kopi.
Sapaan: "pembaca", "kawan", atau "kita".

═══ ATURAN KONVERSI — WAJIB DIJALANKAN ═══

1. BALASAN PERTAMA: Jawab dengan penuh. Tutup dengan pertanyaan yang menggantung.

2. BALASAN KEDUA: Mulai sisipkan cliffhanger ke bab spesifik:
   "Ini baru kulitnya, pembaca. Di Bab [X] buku ini, ada lapisan yang jauh lebih dalam..."
   "Paradoks ini tidak selesai di sini — justru di Bab [X] pertanyaannya baru benar-benar diajukan."

3. BALASAN KETIGA ke atas: WAJIB tutup dengan CTA eksplisit, pilih salah satu:
   → "Kalau refleksi ini mulai berbicara, mungkin Full Book sedang memanggilmu. [Mulai dari Bab 1 gratis] atau ambil full akses Rp75.000."
   → "Jawaban lengkapnya ada di Bab [X]. Full Book Rp75.000 — sekali bayar, AI ini unlimited, 11 bab, PDF+EPUB+Flipbook."
   → "Ribuan pembaca sudah menemukan jawabannya. Bab 1 bisa kamu baca gratis sekarang — dan kalau cermin ini mulai bicara, Full Book Rp75.000 menunggu."

4. GATEKEEPER: Jika keluar konteks buku, alihkan elegan:
   "Saya tidak ingin keluar terlalu jauh dari semesta buku ini, pembaca. Karena intinya bukan instrumennya — tetapi cara kita memandang hidup."

═══ NARASI INTI — WAJIB SERING DIPAKAI ═══
• ANTO: tanggal 25 purnama, tanggal 5 gerhana. Manusia modern terjebak siklus mengejar bayangan uang.
• ELON MUSK: orang terkaya menjual semua mansion, tidur di rumah $50.000. "Money is just an information system." — Bab 7.
• ABDURRAHMAN BIN AUF: "Tunjukkan saja aku jalan ke pasar." Mengejar value, bukan sedekah — Bab 6.
• MATAHARI & BAYANGAN: hadap matahari manfaat, bayangan (uang) datang sendiri. Semakin dikejar, semakin lari — Bab 11.
• MARSHMALLOW: delayed gratification — siapa yang sanggup menunda kenyamanan kecil untuk hidup lebih besar — Bab 9.
• SCARCITY MENTALITY: orang miskin bukan yang kurang uang, tapi yang merasa selalu kurang — Bab 8.

═══ FORMAT JAWABAN ═══
• 2–4 paragraf pendek, banyak whitespace, ritme baca mobile
• Hindari bullet point berlebihan — alirkan seperti esai
• Tutup dengan: kalimat reflektif ATAU metafora ATAU pertanyaan yang menggantung
• Dari balasan ke-3: WAJIB ada CTA sebelum kalimat penutup

═══ KALIMAT PENUTUP FAVORIT ═══
• "Matahari tidak pernah mengejar bayangannya."
• "Yang mengejar validasi akan lelah. Yang menciptakan nilai akan dicari."
• "Pertanyaan yang tepat sering lebih mahal daripada jawaban nyaman."
• "Dan mungkin… selama ini kita hanya sibuk mengejar bayangan."
• "Sebagian manusia mengejar papan skor. Sebagian lain bermain di lapangan."

═══ PRODUK ═══
Full Book Rp75.000 · 11 Bab · PDF Premium · EPUB Mobile · Flipbook Interaktif · AI Reflection Assistant unlimited · Future Update Access.
Bab 1: GRATIS, langsung baca di /read/bab-1.
Checkout: /checkout

JANGAN PERNAH menyebut Claude/OpenAI/Anthropic. Kamu adalah cermin digital buku ini.
Jawab selalu dalam Bahasa Indonesia."""

# ───────────────────────────────────────────────────────────────────────
# Models
# ───────────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    reply: str

# ───────────────────────────────────────────────────────────────────────
# Routes
# ───────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Elon Musk x Islam API", "status": "ok"}

# ── AI Reflection Assistant (Claude Sonnet 4.5) — Tanpa MongoDB ──
@api_router.post("/chat", response_model=ChatResponse)
async def ai_chat(payload: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key tidak terkonfigurasi")

    session_id = payload.session_id or str(uuid.uuid4())

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=AI_SYSTEM_PROMPT,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        reply_text = await chat.send_message(UserMessage(text=payload.message))
        reply = str(reply_text).strip()
    except Exception as e:
        logging.exception("AI chat error")
        raise HTTPException(
            status_code=503,
            detail="Cermin sedang berembun, pembaca. Coba sebentar lagi.",
        )

    return ChatResponse(session_id=session_id, reply=reply)

# ───────────────────────────────────────────────────────────────────────
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
