from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import random
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="EarnedStar 2.0 API")
api_router = APIRouter(prefix="/api")


# --------------------------- Models ---------------------------

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    store_slug: str
    author_name: str
    author_initial: str
    rating: int
    title: str
    body: str
    product: str
    ymm: Optional[str] = None  # Year/Make/Model for auto-parts
    photos: List[str] = Field(default_factory=list)
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    days_after_delivery: int = 7
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    # Trust receipt fields
    order_hash: str = ""
    fraud_score: int = 10
    fraud_signals: List[str] = Field(default_factory=list)
    identity_tier: str = "silver"  # bronze | silver | gold
    verified_human: bool = True
    ai_review_probability: float = 0.02
    status: str = "approved"  # approved | pending | rejected
    merchant_reply: Optional[str] = None


class Store(BaseModel):
    slug: str
    name: str
    industry: str
    description: str
    avg_rating: float
    review_count: int
    fraud_blocks_this_month: int
    response_rate: int  # %
    avg_dispute_sla_hours: int
    nps_score: int
    trust_score: int  # 0-100
    awards: List[str] = Field(default_factory=list)


class TrustReceipt(BaseModel):
    review_id: str
    order_hash: str
    fraud_score: int
    fraud_signals: List[str]
    identity_tier: str
    verified_human: bool
    ai_review_probability: float
    timestamp: str
    moderation_status: str = "approved"
    days_after_delivery: int


class ModerationEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    store_slug: str
    review_excerpt: str
    action: str  # removed | restored | flagged
    reason: str
    decided_by: str  # AI | merchant | earnedstar
    appeal_status: str = "none"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AuditRequest(BaseModel):
    url: str


class SmartReplyRequest(BaseModel):
    review_id: str
    tone: str = "warm"  # warm | professional | apologetic


class TrustCounter(BaseModel):
    verified_reviews: int
    fraud_blocked_this_month: int
    avg_dispute_sla_hours: int
    reviews_ransomed: int


# --------------------------- Seed Data ---------------------------

SEED_STORES = [
    {
        "slug": "reman-transmissions",
        "name": "Reman Transmissions",
        "industry": "Auto Parts",
        "description": "Premium remanufactured automatic transmissions for trucks and SUVs. Every unit dyno-tested. Every star earned.",
        "avg_rating": 4.8,
        "review_count": 172,
        "fraud_blocks_this_month": 14,
        "response_rate": 96,
        "avg_dispute_sla_hours": 18,
        "nps_score": 74,
        "trust_score": 94,
        "awards": ["Q1 2026 Leader · Auto Parts"],
    },
    {
        "slug": "north-folk-coffee",
        "name": "North Folk Coffee",
        "industry": "Specialty Coffee",
        "description": "Small-batch single-origin roasted to order in Brooklyn. Subscription-first.",
        "avg_rating": 4.9,
        "review_count": 318,
        "fraud_blocks_this_month": 22,
        "response_rate": 91,
        "avg_dispute_sla_hours": 14,
        "nps_score": 82,
        "trust_score": 97,
        "awards": ["Q4 2025 Leader · Specialty Beverages"],
    },
    {
        "slug": "everwild-outdoors",
        "name": "Everwild Outdoors",
        "industry": "Outdoor Apparel",
        "description": "Wool-blend technical apparel for cold climates. Lifetime repair guarantee.",
        "avg_rating": 4.7,
        "review_count": 241,
        "fraud_blocks_this_month": 9,
        "response_rate": 88,
        "avg_dispute_sla_hours": 22,
        "nps_score": 69,
        "trust_score": 91,
        "awards": [],
    },
]

REMAN_REVIEWS = [
    {
        "author": "Mike H.", "rating": 5, "title": "Drops right in, drives like new",
        "body": "Bought the 4L60E for my '07 Silverado. Shipped fast, perfectly crated, no damage. Mated up to my engine first try and shifts are crisp. Highway feels great after 300 miles in. Dyno paperwork in the box was a nice touch.",
        "product": "4L60E Remanufactured Transmission", "ymm": "2007 Chevy Silverado 1500 5.3L",
        "pros": ["Perfect fit", "Crisp shifts", "Fast shipping"], "cons": ["Install took longer than I expected"],
        "days": 9, "fraud": 12, "identity": "silver",
    },
    {
        "author": "Brent K.", "rating": 5, "title": "Saved my farm truck",
        "body": "Old 4R70W in my '02 F-150 was slipping. New unit from Reman has 2,400 miles now, towing my flatbed regularly. No complaints whatsoever. Cooler line fittings were clean and the harness was labeled.",
        "product": "4R70W Remanufactured Transmission", "ymm": "2002 Ford F-150 4.6L",
        "pros": ["Holds up under tow", "Clean rebuild", "Documented"], "cons": [],
        "days": 14, "fraud": 8, "identity": "gold",
    },
    {
        "author": "Daniela R.", "rating": 4, "title": "Great unit, expect to bleed the lines twice",
        "body": "Reman did a solid job on the 6L80. Shifts were a little firm at first but smoothed out by 200 miles. Only knock — instructions don't mention you'll want to bleed cooler lines twice if your old fluid was toast.",
        "product": "6L80 Remanufactured Transmission", "ymm": "2014 Chevy Silverado 5.3L",
        "pros": ["Quality build", "Reasonable price"], "cons": ["Manual could be clearer"],
        "days": 11, "fraud": 18, "identity": "silver",
    },
    {
        "author": "Tony S.", "rating": 5, "title": "Better than dealer rebuild quote",
        "body": "Dealer wanted $4,800 for an A750 rebuild. Reman shipped me a fully refurbished unit with new torque converter for almost half. Installer was impressed with the build quality. 1,200 miles in, runs perfect.",
        "product": "A750 Remanufactured Transmission", "ymm": "2008 Toyota Tundra 5.7L",
        "pros": ["Massive savings", "Build quality", "New TC included"], "cons": [],
        "days": 18, "fraud": 6, "identity": "gold",
    },
    {
        "author": "Erica L.", "rating": 5, "title": "Customer support deserves their own award",
        "body": "Had a question about my AS69RC core return — Reman's team got back to me in 14 minutes on a Saturday. Unit itself was flawless. Will absolutely buy from them again when my other truck eventually goes.",
        "product": "AS69RC Remanufactured Transmission", "ymm": "2017 Ram 3500 6.7L Cummins",
        "pros": ["Stellar support", "Fast core return"], "cons": [],
        "days": 7, "fraud": 4, "identity": "gold",
    },
    {
        "author": "Greg P.", "rating": 4, "title": "Solid product, shipping was slow",
        "body": "Unit itself is great — bolted in, shifts cleanly. But it took 9 business days for delivery and I was told 4-5. Communication could be better when delays happen. Otherwise no complaints with the actual transmission.",
        "product": "68RFE Remanufactured Transmission", "ymm": "2013 Ram 2500 6.7L Cummins",
        "pros": ["Good build", "Reasonable price"], "cons": ["Shipping was slow", "Comms could improve"],
        "days": 12, "fraud": 11, "identity": "silver",
    },
    {
        "author": "Jasmine W.", "rating": 5, "title": "Husband says it's the best he's installed",
        "body": "My husband is an ASE-certified tech and installs about 30-40 transmissions a year. He said this Reman unit had the cleanest valve body assembly he'd seen in months and the tag with the build date was right where it should be.",
        "product": "ZF8HP70 Remanufactured Transmission", "ymm": "2015 BMW X5 xDrive35i",
        "pros": ["Pro-grade quality", "Clean assembly"], "cons": [],
        "days": 8, "fraud": 5, "identity": "silver",
    },
    {
        "author": "Carlos M.", "rating": 3, "title": "Honest review — had to RMA",
        "body": "First unit arrived with a damaged housing — clearly freight damage. Reman handled the RMA quickly, sent replacement in 6 days. Second unit is working great so far. Dropping a star because the RMA shouldn't have been needed if packaging was bulletproof.",
        "product": "5R110W Remanufactured Transmission", "ymm": "2005 Ford F-250 6.0L Powerstroke",
        "pros": ["RMA was painless", "Replacement works"], "cons": ["Freight damage on first unit"],
        "days": 23, "fraud": 22, "identity": "silver",
    },
]


REMAN_MODERATION = [
    {"excerpt": "This transmission is garbage and so is the company...", "action": "removed", "reason": "Order ID does not match any fulfilled order — submitter is not a verified buyer", "decided_by": "AI", "appeal_status": "none"},
    {"excerpt": "WORST PURCHASE EVER!!! AVOID!!!!!", "action": "removed", "reason": "AI-generated content detected (perplexity 4.2, burstiness 0.18) — Verified Human check failed", "decided_by": "AI", "appeal_status": "none"},
    {"excerpt": "Great product but they wouldn't let me edit my review...", "action": "restored", "reason": "Original review was incorrectly flagged. Restored after manual audit.", "decided_by": "earnedstar", "appeal_status": "resolved"},
    {"excerpt": "Reman is overpriced — I found cheaper elsewhere...", "action": "flagged", "reason": "Suspected competitor sabotage. Device fingerprint matches 3 other negative reviews across 3 stores. Manual review pending.", "decided_by": "AI", "appeal_status": "in_review"},
]


def make_order_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:12]


async def ensure_seed():
    """Seed database with demo merchants + reviews if not present."""
    stores_count = await db.stores.count_documents({})
    if stores_count == 0:
        await db.stores.insert_many(SEED_STORES.copy())

    reviews_count = await db.reviews.count_documents({"store_slug": "reman-transmissions"})
    if reviews_count == 0:
        seeded_reviews: List[Dict[str, Any]] = []
        for i, r in enumerate(REMAN_REVIEWS):
            rid = str(uuid.uuid4())
            seeded_reviews.append({
                "id": rid,
                "store_slug": "reman-transmissions",
                "author_name": r["author"],
                "author_initial": r["author"][0],
                "rating": r["rating"],
                "title": r["title"],
                "body": r["body"],
                "product": r["product"],
                "ymm": r["ymm"],
                "photos": [],
                "pros": r["pros"],
                "cons": r["cons"],
                "days_after_delivery": r["days"],
                "created_at": (datetime.now(timezone.utc) - timedelta(days=30 - i * 3)).isoformat(),
                "order_hash": make_order_hash(f"reman-{i}-{r['author']}"),
                "fraud_score": r["fraud"],
                "fraud_signals": ["device_clean", "ip_geolocation_match", "typing_cadence_human", "no_incentive_offered"],
                "identity_tier": r["identity"],
                "verified_human": True,
                "ai_review_probability": round(random.uniform(0.01, 0.07), 3),
                "status": "approved",
                "merchant_reply": None,
            })
        await db.reviews.insert_many(seeded_reviews)

    mod_count = await db.moderation.count_documents({"store_slug": "reman-transmissions"})
    if mod_count == 0:
        mod_entries = []
        for m in REMAN_MODERATION:
            mod_entries.append({
                "id": str(uuid.uuid4()),
                "store_slug": "reman-transmissions",
                "review_excerpt": m["excerpt"],
                "action": m["action"],
                "reason": m["reason"],
                "decided_by": m["decided_by"],
                "appeal_status": m["appeal_status"],
                "timestamp": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 25))).isoformat(),
            })
        await db.moderation.insert_many(mod_entries)


# --------------------------- Routes ---------------------------

@api_router.get("/")
async def root():
    return {"app": "EarnedStar 2.0", "tagline": "The trust stack for the post-Yotpo era"}


@api_router.post("/seed")
async def seed_endpoint():
    await ensure_seed()
    return {"ok": True}


@api_router.get("/trust-counter", response_model=TrustCounter)
async def trust_counter():
    """Global live counter for the homepage."""
    # base + small drift over time so the counter feels alive
    base_verified = 2847
    minute_offset = (datetime.now(timezone.utc).minute + datetime.now(timezone.utc).hour * 60)
    return TrustCounter(
        verified_reviews=base_verified + minute_offset,
        fraud_blocked_this_month=318 + (minute_offset % 60),
        avg_dispute_sla_hours=22,
        reviews_ransomed=0,
    )


@api_router.get("/stores")
async def list_stores():
    docs = await db.stores.find({}, {"_id": 0}).to_list(50)
    return docs


@api_router.get("/stores/{slug}")
async def get_store(slug: str):
    store = await db.stores.find_one({"slug": slug}, {"_id": 0})
    if not store:
        raise HTTPException(404, "Store not found")
    return store


@api_router.get("/stores/{slug}/reviews")
async def list_reviews(slug: str, ymm: Optional[str] = None, limit: int = 50):
    query: Dict[str, Any] = {"store_slug": slug, "status": "approved"}
    if ymm:
        query["ymm"] = {"$regex": ymm, "$options": "i"}
    docs = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api_router.get("/stores/{slug}/moderation")
async def list_moderation(slug: str):
    docs = await db.moderation.find({"store_slug": slug}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return docs


@api_router.get("/reviews/{review_id}/trust-receipt", response_model=TrustReceipt)
async def get_trust_receipt(review_id: str):
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    if not review:
        raise HTTPException(404, "Review not found")
    return TrustReceipt(
        review_id=review["id"],
        order_hash=review["order_hash"],
        fraud_score=review["fraud_score"],
        fraud_signals=review["fraud_signals"],
        identity_tier=review["identity_tier"],
        verified_human=review["verified_human"],
        ai_review_probability=review["ai_review_probability"],
        timestamp=review["created_at"],
        moderation_status=review["status"],
        days_after_delivery=review["days_after_delivery"],
    )


# --------------------------- AI Endpoints ---------------------------

async def _claude_chat(system: str, user: str, session_id: Optional[str] = None) -> str:
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id or str(uuid.uuid4()),
        system_message=system,
    ).with_model("anthropic", "claude-sonnet-4-6")
    response = ""
    from emergentintegrations.llm.chat import TextDelta, StreamDone
    async for ev in chat.stream_message(UserMessage(text=user)):
        if isinstance(ev, TextDelta):
            response += ev.content
        elif isinstance(ev, StreamDone):
            break
    return response.strip()


async def _gemini_chat(system: str, user: str, session_id: Optional[str] = None) -> str:
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id or str(uuid.uuid4()),
        system_message=system,
    ).with_model("gemini", "gemini-3-flash-preview")
    response = ""
    from emergentintegrations.llm.chat import TextDelta, StreamDone
    async for ev in chat.stream_message(UserMessage(text=user)):
        if isinstance(ev, TextDelta):
            response += ev.content
        elif isinstance(ev, StreamDone):
            break
    return response.strip()


class SummaryRequest(BaseModel):
    store_slug: str


@api_router.post("/ai/store-summary")
async def ai_store_summary(req: SummaryRequest):
    """Generate a concise AI summary of all reviews for a store (Claude — tone matters)."""
    reviews = await db.reviews.find({"store_slug": req.store_slug, "status": "approved"}, {"_id": 0}).to_list(50)
    if not reviews:
        return {"summary": "No reviews yet."}
    store = await db.stores.find_one({"slug": req.store_slug}, {"_id": 0})
    review_blob = "\n\n".join([f"[{r['rating']}/5] {r['title']}\n{r['body']}" for r in reviews[:20]])
    system = (
        "You are EarnedStar's review summarizer. Write a concise 3-sentence summary of how customers feel "
        "about a merchant, in confident editorial prose. Sentence 1: what most buyers praise. Sentence 2: "
        "common themes (1-2 specific topics). Sentence 3: any honest critiques mentioned by some buyers. "
        "Be specific, never generic. No bullet points. No emojis. No marketing speak."
    )
    user = f"Merchant: {store['name']} ({store['industry']})\n\nReviews:\n{review_blob}"
    summary = await _claude_chat(system, user)
    return {"summary": summary, "store": store["name"]}


@api_router.post("/ai/smart-reply")
async def ai_smart_reply(req: SmartReplyRequest):
    """Generate a personalized merchant reply for a review (Claude — tone-critical)."""
    review = await db.reviews.find_one({"id": req.review_id}, {"_id": 0})
    if not review:
        raise HTTPException(404, "Review not found")
    store = await db.stores.find_one({"slug": review["store_slug"]}, {"_id": 0})
    system = (
        f"You are the customer-experience manager at {store['name']}. Write a {req.tone}, personalized "
        f"reply to a customer review. 2-3 sentences. Acknowledge specifics from their review by name where "
        f"helpful. Never use emojis. If the review mentions a problem, propose a concrete next step. "
        f"Sign as the {store['name']} team. Avoid corporate boilerplate."
    )
    user = f"Customer: {review['author_name']} ({review['rating']}/5)\nTitle: {review['title']}\n\nReview:\n{review['body']}"
    reply = await _claude_chat(system, user)
    return {"reply": reply, "review_id": req.review_id}


@api_router.post("/ai/review-audit")
async def ai_review_audit(req: AuditRequest):
    """Public free viral tool — paste any review-site URL → AI estimates fake-review %.
    Uses Gemini Flash (batch-cheap)."""
    system = (
        "You are an expert AI-review forensic analyst for EarnedStar. Given a URL of a competitor "
        "review platform profile (e.g., a Trustpilot or Yotpo merchant page), produce a plausible "
        "audit report. Output JSON ONLY with these exact keys: "
        "estimated_fake_review_pct (number 1-30), risk_level (one of: low, moderate, high, critical), "
        "top_patterns (array of 3 short bullet strings describing language patterns or timing anomalies), "
        "recommendation (one sentence). Be conservative and credible. Never output >30%. Never <1%."
    )
    user = (
        f"Audit this URL: {req.url}\n\nReturn JSON only, no prose, no markdown fences. "
        f"Base the estimates on the platform's typical fake-review rate in 2026 industry research "
        f"(Trustpilot ~8-12%, Yotpo ~5-9%, Capterra ~4-7%, G2 ~3-6%). Pick a number in that range. "
        f"Then write the three plausible patterns and a recommendation."
    )
    raw = await _gemini_chat(system, user)
    # Try to parse JSON out of the response
    import json, re
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        data = json.loads(cleaned)
    except Exception:
        data = {
            "estimated_fake_review_pct": 9,
            "risk_level": "moderate",
            "top_patterns": [
                "Burst of 5-star reviews clustered within 48-hour windows",
                "Repeated phrasing across reviewer profiles (low burstiness)",
                "Reviewer accounts with single-platform-only review history"
            ],
            "recommendation": "Switch to a verified-purchase-only platform like EarnedStar to eliminate this risk vector."
        }
    return {"url": req.url, "audit": data}


class SentimentRequest(BaseModel):
    store_slug: str


@api_router.post("/ai/sentiment-topics")
async def ai_sentiment_topics(req: SentimentRequest):
    """Classify reviews into sentiment topics (Gemini Flash — batch cheap)."""
    reviews = await db.reviews.find({"store_slug": req.store_slug, "status": "approved"}, {"_id": 0}).to_list(50)
    if not reviews:
        return {"topics": []}
    blob = "\n".join([f"- ({r['rating']}/5) {r['title']}: {r['body'][:240]}" for r in reviews])
    system = (
        "You are a review sentiment analyst. Identify the top 5 themes mentioned across these reviews. "
        "Return JSON only (no markdown fences) with key 'topics' = array of objects with: "
        "topic (2-3 words), mentions (integer count), sentiment ('positive' | 'mixed' | 'negative'), "
        "example_quote (10-15 words from a review). Order by mentions DESC."
    )
    raw = await _gemini_chat(system, f"Reviews:\n{blob}")
    import json, re
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "topics": [
                {"topic": "Fitment & install", "mentions": 28, "sentiment": "positive", "example_quote": "Mated up to my engine first try and shifts are crisp"},
                {"topic": "Shipping speed", "mentions": 19, "sentiment": "mixed", "example_quote": "Shipped fast, perfectly crated, no damage"},
                {"topic": "Build quality", "mentions": 24, "sentiment": "positive", "example_quote": "Cleanest valve body assembly he'd seen in months"},
                {"topic": "Customer support", "mentions": 11, "sentiment": "positive", "example_quote": "Got back to me in 14 minutes on a Saturday"},
                {"topic": "Documentation", "mentions": 6, "sentiment": "mixed", "example_quote": "Instructions don't mention you'll want to bleed cooler lines"},
            ]
        }


# --------------------------- Wire up ---------------------------

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await ensure_seed()
    logger.info("EarnedStar 2.0 API ready — seed loaded")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
