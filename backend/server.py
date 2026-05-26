"""
ELON MUSK × ISLAM — Backend
FastAPI + MongoDB + Claude Sonnet 4.5 (Emergent LLM)
"""
import csv
import io
import logging
import os
import secrets
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI(title="Elon Musk x Islam API")
api_router = APIRouter(prefix="/api")

# ───────────────────────────────────────────────────────────────────────
# AI System Prompt — strict gatekeeper, philosophical reflection
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
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    whatsapp: str
    city: Optional[str] = ""
    profession: Optional[str] = ""
    source: Optional[str] = "landing"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    whatsapp: str
    city: Optional[str] = ""
    profession: Optional[str] = ""
    source: Optional[str] = "landing"


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str = Field(default_factory=lambda: f"EMI-{secrets.token_hex(4).upper()}")
    name: str
    email: str
    whatsapp: str
    city: Optional[str] = ""
    profession: Optional[str] = ""
    amount: int = 75000
    product: str = "FULL_BOOK"
    status: str = "pending"
    access_token: str = Field(default_factory=lambda: secrets.token_urlsafe(16))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class OrderCreate(BaseModel):
    name: str
    email: EmailStr
    whatsapp: str
    city: Optional[str] = ""
    profession: Optional[str] = ""
    product: Optional[str] = "FULL_BOOK"


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class TrackEvent(BaseModel):
    event: str
    meta: Optional[dict] = {}


# ───────────────────────────────────────────────────────────────────────
# Routes
# ───────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Elon Musk x Islam API", "status": "ok"}


# ── Leads ──────────────────────────────────────────────────────────────
@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api_router.get("/leads/export")
async def export_leads_csv():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "name", "email", "whatsapp", "city", "profession", "source", "created_at"])
    for d in docs:
        writer.writerow([
            d.get("id", ""), d.get("name", ""), d.get("email", ""), d.get("whatsapp", ""),
            d.get("city", ""), d.get("profession", ""), d.get("source", ""), d.get("created_at", ""),
        ])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=emi-leads.csv"},
    )


# ── Orders (Mock Checkout) ─────────────────────────────────────────────
@api_router.post("/orders")
async def create_order(payload: OrderCreate):
    order = Order(**payload.model_dump())
    await db.orders.insert_one(order.model_dump())
    # Mock: immediately mark as paid (real flow waits for Midtrans webhook)
    await db.orders.update_one({"id": order.id}, {"$set": {"status": "paid"}})
    order.status = "paid"
    return {
        "order_id": order.order_id,
        "access_token": order.access_token,
        "status": order.status,
        "amount": order.amount,
        "redirect_url": f"/success/{order.access_token}",
    }


@api_router.get("/orders/by-token/{token}")
async def get_order_by_token(token: str):
    doc = await db.orders.find_one({"access_token": token}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "order_id": doc["order_id"],
        "name": doc["name"],
        "email": doc["email"],
        "status": doc["status"],
        "amount": doc["amount"],
        "downloads": {
            "pdf": f"/api/download/pdf/{token}",
            "epub": f"/api/download/epub/{token}",
            "flipbook": f"/api/download/flipbook/{token}",
        },
    }


@api_router.get("/download/{kind}/{token}")
async def download_file(kind: str, token: str):
    doc = await db.orders.find_one({"access_token": token}, {"_id": 0})
    if not doc or doc.get("status") != "paid":
        raise HTTPException(status_code=403, detail="Akses ditolak — order tidak valid")
    if kind not in {"pdf", "epub", "flipbook"}:
        raise HTTPException(status_code=400, detail="Format tidak dikenal")
    # MOCKED — placeholder content. Real file delivery TBD.
    placeholder = (
        f"ELON MUSK x ISLAM — Didi Subandi\n"
        f"Format: {kind.upper()} (PLACEHOLDER — file asli akan dikirim ke email)\n"
        f"Order: {doc['order_id']}\n"
        f"Pembaca: {doc['name']}\n"
        f"Akses: selamanya.\n\n"
        f"Matahari tidak pernah mengejar bayangannya.\n"
    )
    return StreamingResponse(
        iter([placeholder]),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=elon-musk-islam.{kind}.txt"},
    )


# ── AI Reflection Assistant (Claude Sonnet 4.5) ────────────────────────
@api_router.post("/chat", response_model=ChatResponse)
async def ai_chat(payload: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key tidak terkonfigurasi")

    session_id = payload.session_id or str(uuid.uuid4())

    # Persist user message
    await db.chat_messages.insert_one({
        "session_id": session_id,
        "role": "user",
        "content": payload.message,
        "ts": datetime.now(timezone.utc).isoformat(),
    })

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
        # Sanitized Indonesian fallback — do not leak provider internals
        raise HTTPException(
            status_code=503,
            detail="Cermin sedang berembun, pembaca. Coba sebentar lagi.",
        )

    await db.chat_messages.insert_one({
        "session_id": session_id,
        "role": "assistant",
        "content": reply,
        "ts": datetime.now(timezone.utc).isoformat(),
    })

    return ChatResponse(session_id=session_id, reply=reply)


@api_router.get("/chat/{session_id}")
async def chat_history(session_id: str):
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(200)
    return {"session_id": session_id, "messages": msgs}


# ── Tracking ───────────────────────────────────────────────────────────
@api_router.post("/track")
async def track_event(payload: TrackEvent):
    await db.events.insert_one({
        "event": payload.event,
        "meta": payload.meta or {},
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


@api_router.get("/stats")
async def stats():
    leads = await db.leads.count_documents({})
    orders = await db.orders.count_documents({"status": "paid"})
    events = await db.events.count_documents({})
    return {"leads": leads, "paid_orders": orders, "events": events}


# ───────────────────────────────────────────────────────────────────────
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
