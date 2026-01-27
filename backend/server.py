from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import base64
import resend
import bcrypt
import jwt
from io import BytesIO
import secrets
import string
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'info@haggai.se')

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'haggai-sweden-board-secret-key-2026')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 1 week

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Leader/Facilitator Model
class Leader(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: dict  # {sv: "", en: "", ar: ""}
    bio: dict  # {sv: "", en: "", ar: ""}
    topics: dict  # {sv: [], en: [], ar: []}
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeaderCreate(BaseModel):
    name: str
    role: dict
    bio: dict
    topics: dict
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class LeaderUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[dict] = None
    bio: Optional[dict] = None
    topics: Optional[dict] = None
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


# Board Member Model
class BoardMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str  # Ordförande, Kassör, Ledamot, Sekreterare, etc.
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    term_start: str  # Start year of term, e.g., "2025"
    term_end: Optional[str] = None  # End year of term, None if current
    is_current: bool = True
    # Authentication fields
    password_hash: Optional[str] = None
    is_account_active: bool = False  # True when they've set a password
    last_login: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BoardMemberCreate(BaseModel):
    name: str
    role: str
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    term_start: str
    term_end: Optional[str] = None
    is_current: bool = True


class BoardMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    term_start: Optional[str] = None
    term_end: Optional[str] = None
    is_current: Optional[bool] = None


# Contact Form Model
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str


# Membership Application Model
class MembershipApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_type: str  # individual, church, organization
    first_name: str
    last_name: str
    email: str
    phone: str
    organization: Optional[str] = None
    city: str
    message: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class MembershipCreate(BaseModel):
    member_type: str
    first_name: str
    last_name: str
    email: str
    phone: str
    organization: Optional[str] = None
    city: str
    message: Optional[str] = None


# Leader Experience Application Model
class LeaderExperienceApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    program_id: str
    nomination_type: str  # self, friend
    first_name: str
    last_name: str
    email: str
    phone: str
    city: str
    country: str
    church_or_organization: str
    current_role: str
    years_in_role: int
    ministry_description: str
    why_apply: str
    expectations: str
    nominator_name: Optional[str] = None
    nominator_email: Optional[str] = None
    nominator_phone: Optional[str] = None
    nominator_relationship: Optional[str] = None
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeaderExperienceApplicationCreate(BaseModel):
    program_id: str
    nomination_type: str
    first_name: str
    last_name: str
    email: str
    phone: str
    city: str
    country: str
    church_or_organization: str
    current_role: str
    years_in_role: int
    ministry_description: str
    why_apply: str
    expectations: str
    nominator_name: Optional[str] = None
    nominator_email: Optional[str] = None
    nominator_phone: Optional[str] = None
    nominator_relationship: Optional[str] = None


# Organization Member Model (Churches & Organizations that are members)
class OrganizationMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # church, organization
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    city: Optional[str] = None
    country: str = "Sverige"
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: bool = True
    member_since: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class OrganizationMemberCreate(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    city: Optional[str] = None
    country: str = "Sverige"
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    member_since: Optional[str] = None


# Partner Model
class Partner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    partnership_type: str = "standard"  # standard, premium, strategic
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PartnerCreate(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    partnership_type: str = "standard"


# Testimonial Model
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: Optional[str] = None  # e.g., "Pastor", "Ledare"
    church: Optional[str] = None  # Church or organization name
    quote_sv: str  # Swedish quote
    quote_en: Optional[str] = None  # English quote
    quote_ar: Optional[str] = None  # Arabic quote
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0  # For sorting
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class TestimonialCreate(BaseModel):
    name: str
    role: Optional[str] = None
    church: Optional[str] = None
    quote_sv: str
    quote_en: Optional[str] = None
    quote_ar: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0


class StatusCheckCreate(BaseModel):
    client_name: str


# ==================== LEADER INVITATION & REGISTRATION MODELS ====================

class LeaderInvitation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    token: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    email: str
    name: str
    workshop_id: Optional[str] = None  # Optional - for workshop-specific invitations
    workshop_title: Optional[str] = None
    language: str = "sv"  # sv, en, ar
    status: str = "pending"  # pending, registered, expired
    sent_at: Optional[str] = None
    expires_at: str = Field(default_factory=lambda: (datetime.now(timezone.utc) + timedelta(days=30)).isoformat())
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeaderInvitationCreate(BaseModel):
    email: str
    name: str
    workshop_id: Optional[str] = None
    workshop_title: Optional[str] = None
    language: str = "sv"  # sv, en, ar


class LeaderRegistration(BaseModel):
    """Extended leader profile for registered leaders"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invitation_id: Optional[str] = None
    
    # Basic info
    name: str
    email: str
    phone: Optional[str] = None
    
    # Profile
    bio_sv: Optional[str] = None
    bio_en: Optional[str] = None
    bio_ar: Optional[str] = None
    role_sv: Optional[str] = None
    role_en: Optional[str] = None
    role_ar: Optional[str] = None
    topics_sv: Optional[List[str]] = []
    topics_en: Optional[List[str]] = []
    topics_ar: Optional[List[str]] = []
    image_url: Optional[str] = None
    
    # Workshop Topics Selection
    primary_topic: Optional[str] = None  # Main topic they will present
    backup_topics: Optional[List[str]] = []  # Other topics they can cover if needed
    
    # Cost & Travel
    cost_preference: str = "self"  # "self" or "haggai_support"
    arrival_date: Optional[str] = None
    departure_date: Optional[str] = None
    special_dietary: Optional[str] = None
    other_needs: Optional[str] = None
    
    # Bank details (for reimbursements)
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_clearing: Optional[str] = None
    bank_iban: Optional[str] = None
    bank_swift: Optional[str] = None
    
    # Documents
    documents: List[dict] = []  # [{filename, url, type, uploaded_at}]
    # Types: "topic_material", "receipt", "travel_ticket", "other"
    
    # Authentication
    password_hash: Optional[str] = None
    
    # Status
    status: str = "pending"  # pending, approved, rejected
    admin_notes: Optional[str] = None
    approved_at: Optional[str] = None
    approved_by: Optional[str] = None
    
    # Metadata
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeaderRegistrationCreate(BaseModel):
    """Data submitted by leader during registration"""
    name: str
    email: str
    phone: Optional[str] = None
    password: str
    profile_image: Optional[str] = None
    
    # Profile
    bio_sv: Optional[str] = None
    bio_en: Optional[str] = None
    role_sv: Optional[str] = None
    role_en: Optional[str] = None
    topics_sv: Optional[List[str]] = []
    topics_en: Optional[List[str]] = []
    
    # Workshop Topics Selection
    primary_topic: Optional[str] = None  # Main topic they will present
    backup_topics: Optional[List[str]] = []  # Other topics they can cover if needed
    
    # Cost & Travel
    cost_preference: str = "self"
    arrival_date: Optional[str] = None
    departure_date: Optional[str] = None
    special_dietary: Optional[str] = None
    other_needs: Optional[str] = None
    
    # Bank details
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_clearing: Optional[str] = None
    bank_iban: Optional[str] = None
    bank_swift: Optional[str] = None


class LeaderRegistrationUpdate(BaseModel):
    """For leaders updating their own profile"""
    phone: Optional[str] = None
    bio_sv: Optional[str] = None
    bio_en: Optional[str] = None
    bio_ar: Optional[str] = None
    role_sv: Optional[str] = None
    role_en: Optional[str] = None
    role_ar: Optional[str] = None
    topics_sv: Optional[List[str]] = None
    topics_en: Optional[List[str]] = None
    topics_ar: Optional[List[str]] = None
    image_url: Optional[str] = None
    
    cost_preference: Optional[str] = None
    arrival_date: Optional[str] = None
    departure_date: Optional[str] = None
    special_dietary: Optional[str] = None
    other_needs: Optional[str] = None
    
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_clearing: Optional[str] = None
    bank_iban: Optional[str] = None
    bank_swift: Optional[str] = None


class LeaderLogin(BaseModel):
    email: str
    password: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ==================== LEADER/FACILITATOR ENDPOINTS ====================

# --- Leader Portal (Login & Profile) - Must be before /leaders/{leader_id} ---

@api_router.get("/leaders/me")
async def get_current_leader(authorization: str = Header(None)):
    """Get current logged-in leader's profile"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Ej auktoriserad")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "leader":
            raise HTTPException(status_code=401, detail="Ogiltig token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    leader = await db.leader_registrations.find_one(
        {"id": payload['sub']},
        {"_id": 0, "password_hash": 0}
    )
    if not leader:
        raise HTTPException(status_code=404, detail="Ledare hittades inte")
    
    return leader


@api_router.put("/leaders/me")
async def update_current_leader(input: LeaderRegistrationUpdate = None, authorization: str = Header(None)):
    """Update current leader's profile"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Ej auktoriserad")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "leader":
            raise HTTPException(status_code=401, detail="Ogiltig token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    leader_id = payload['sub']
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.leader_registrations.update_one(
        {"id": leader_id},
        {"$set": update_data}
    )
    
    # Also update main leaders collection if approved
    leader = await db.leader_registrations.find_one({"id": leader_id})
    if leader and leader.get("status") == "approved":
        leader_update = {}
        if "bio_sv" in update_data or "bio_en" in update_data or "bio_ar" in update_data:
            leader_update["bio"] = {
                "sv": leader.get('bio_sv', ''),
                "en": leader.get('bio_en', ''),
                "ar": leader.get('bio_ar', '')
            }
        if "role_sv" in update_data or "role_en" in update_data or "role_ar" in update_data:
            leader_update["role"] = {
                "sv": leader.get('role_sv', ''),
                "en": leader.get('role_en', ''),
                "ar": leader.get('role_ar', '')
            }
        if "topics_sv" in update_data or "topics_en" in update_data or "topics_ar" in update_data:
            leader_update["topics"] = {
                "sv": leader.get('topics_sv', []),
                "en": leader.get('topics_en', []),
                "ar": leader.get('topics_ar', [])
            }
        if "image_url" in update_data:
            leader_update["image_url"] = update_data["image_url"]
        if "phone" in update_data:
            leader_update["phone"] = update_data["phone"]
        
        if leader_update:
            leader_update["updated_at"] = datetime.now(timezone.utc).isoformat()
            await db.leaders.update_one({"id": leader_id}, {"$set": leader_update})
    
    updated = await db.leader_registrations.find_one({"id": leader_id}, {"_id": 0, "password_hash": 0})
    return updated


# --- Public Leader Endpoints ---

@api_router.get("/leaders", response_model=List[Leader])
async def get_leaders(active_only: bool = True):
    """Get all leaders/facilitators"""
    query = {"is_active": True} if active_only else {}
    leaders = await db.leaders.find(query, {"_id": 0}).to_list(100)
    return leaders


@api_router.get("/leaders/{leader_id}", response_model=Leader)
async def get_leader(leader_id: str):
    """Get a specific leader by ID"""
    leader = await db.leaders.find_one({"id": leader_id}, {"_id": 0})
    if not leader:
        raise HTTPException(status_code=404, detail="Leader not found")
    return leader


@api_router.post("/leaders", response_model=Leader)
async def create_leader(input: LeaderCreate):
    """Create a new leader/facilitator"""
    leader = Leader(**input.model_dump())
    doc = leader.model_dump()
    await db.leaders.insert_one(doc)
    return leader


@api_router.put("/leaders/{leader_id}", response_model=Leader)
async def update_leader(leader_id: str, input: LeaderUpdate):
    """Update an existing leader"""
    existing = await db.leaders.find_one({"id": leader_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Leader not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.leaders.update_one({"id": leader_id}, {"$set": update_data})
    
    updated = await db.leaders.find_one({"id": leader_id}, {"_id": 0})
    return updated


@api_router.delete("/leaders/{leader_id}")
async def delete_leader(leader_id: str):
    """Delete a leader"""
    result = await db.leaders.delete_one({"id": leader_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Leader not found")
    return {"message": "Leader deleted successfully"}


# ==================== BOARD MEMBER ENDPOINTS ====================

@api_router.get("/board-members", response_model=List[BoardMember])
async def get_board_members(current_only: bool = True):
    """Get board members - optionally filter by current status"""
    query = {"is_current": True} if current_only else {}
    members = await db.board_members.find(query, {"_id": 0}).to_list(100)
    return members


@api_router.get("/board-members/archive", response_model=List[BoardMember])
async def get_archived_board_members():
    """Get all archived (previous) board members"""
    members = await db.board_members.find({"is_current": False}, {"_id": 0}).to_list(100)
    return members


@api_router.get("/board-members/{member_id}", response_model=BoardMember)
async def get_board_member(member_id: str):
    """Get a specific board member by ID"""
    member = await db.board_members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    return member


@api_router.post("/board-members", response_model=BoardMember)
async def create_board_member(input: BoardMemberCreate):
    """Create a new board member"""
    member = BoardMember(**input.model_dump())
    doc = member.model_dump()
    await db.board_members.insert_one(doc)
    return member


@api_router.put("/board-members/{member_id}", response_model=BoardMember)
async def update_board_member(member_id: str, input: BoardMemberUpdate):
    """Update an existing board member"""
    existing = await db.board_members.find_one({"id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    await db.board_members.update_one({"id": member_id}, {"$set": update_data})
    
    updated = await db.board_members.find_one({"id": member_id}, {"_id": 0})
    return updated


@api_router.put("/board-members/{member_id}/archive")
async def archive_board_member(member_id: str, term_end: str):
    """Archive a board member (mark as not current)"""
    existing = await db.board_members.find_one({"id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    await db.board_members.update_one(
        {"id": member_id}, 
        {"$set": {"is_current": False, "term_end": term_end}}
    )
    
    return {"message": "Board member archived successfully"}


@api_router.delete("/board-members/{member_id}")
async def delete_board_member(member_id: str):
    """Delete a board member permanently"""
    result = await db.board_members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Board member not found")
    return {"message": "Board member deleted successfully"}


# ==================== BOARD MEMBER AUTHENTICATION ====================

class BoardMemberLogin(BaseModel):
    email: str
    password: str


class BoardMemberSetPassword(BaseModel):
    email: str
    password: str


class BoardMemberResponse(BaseModel):
    id: str
    name: str
    role: str
    email: Optional[str]
    image_url: Optional[str]
    is_account_active: bool


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))


def create_board_token(member_id: str, email: str, name: str, role: str) -> str:
    payload = {
        "sub": member_id,
        "email": email,
        "name": name,
        "role": role,
        "type": "board_member",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_board_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "board_member":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/board-auth/set-password")
async def set_board_member_password(input: BoardMemberSetPassword):
    """Set password for a board member (first time setup)"""
    member = await db.board_members.find_one({"email": input.email.lower()})
    if not member:
        raise HTTPException(status_code=404, detail="Ingen styrelsemedlem hittades med denna e-post")
    
    password_hash = hash_password(input.password)
    await db.board_members.update_one(
        {"email": input.email.lower()},
        {"$set": {"password_hash": password_hash, "is_account_active": True}}
    )
    
    return {"message": "Lösenord satt framgångsrikt", "success": True}


@api_router.post("/board-auth/login")
async def login_board_member(input: BoardMemberLogin):
    """Login for board members"""
    member = await db.board_members.find_one({"email": input.email.lower()}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=401, detail="Felaktig e-post eller lösenord")
    
    if not member.get("password_hash"):
        raise HTTPException(status_code=400, detail="Inget lösenord är satt. Vänligen skapa ett konto först.")
    
    if not verify_password(input.password, member["password_hash"]):
        raise HTTPException(status_code=401, detail="Felaktig e-post eller lösenord")
    
    # Update last login
    await db.board_members.update_one(
        {"id": member["id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_board_token(member["id"], member["email"], member["name"], member["role"])
    
    return {
        "token": token,
        "member": {
            "id": member["id"],
            "name": member["name"],
            "role": member["role"],
            "email": member["email"],
            "image_url": member.get("image_url")
        }
    }


@api_router.get("/board-auth/me")
async def get_current_board_member(token: str):
    """Get current logged in board member info"""
    payload = verify_board_token(token)
    member = await db.board_members.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    return member


@api_router.get("/board-auth/check-email/{email}")
async def check_board_member_email(email: str):
    """Check if an email belongs to a board member and if they have an account"""
    member = await db.board_members.find_one({"email": email.lower()}, {"_id": 0})
    if not member:
        return {"exists": False, "has_account": False}
    
    return {
        "exists": True,
        "has_account": bool(member.get("password_hash")),
        "name": member.get("name")
    }


# ==================== BOARD MEETING EMAIL NOTIFICATIONS ====================

async def send_meeting_invitation_email(meeting: dict, recipients: List[str]):
    """Send meeting invitation to all board members"""
    agenda_html = ""
    if meeting.get("agenda_items"):
        agenda_items = "".join([
            f'<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">{i+1}. {item.get("title", "")}</td>'
            f'<td style="padding: 8px; border-bottom: 1px solid #eee;">{item.get("responsible", "-")}</td></tr>'
            for i, item in enumerate(meeting["agenda_items"])
        ])
        agenda_html = f'''
        <h3 style="color: #15564e; margin-top: 25px;">Dagordning:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #15564e;">Punkt</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #15564e;">Ansvarig</th>
            </tr>
            {agenda_items}
        </table>
        '''
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #15564e; padding: 25px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📅 Kallelse till Styrelsemöte</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #15564e; margin-top: 0;">{meeting.get("title", "Styrelsemöte")}</h2>
            
            <table style="width: 100%; margin: 20px 0;">
                <tr>
                    <td style="padding: 8px 0;"><strong>📅 Datum:</strong></td>
                    <td style="padding: 8px 0;">{meeting.get("date", "")}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>🕐 Tid:</strong></td>
                    <td style="padding: 8px 0;">{meeting.get("time", "Ej angiven")}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>📍 Plats:</strong></td>
                    <td style="padding: 8px 0;">{meeting.get("location", "Ej angiven")}</td>
                </tr>
            </table>
            
            {agenda_html}
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
                <p style="margin: 0; color: #2e7d32;">
                    <strong>Logga in på medlemsområdet</strong> för att se fullständig information och delta i mötet.
                </p>
            </div>
            
            <div style="margin-top: 25px; text-align: center;">
                <a href="https://peoplepotential.se/medlemmar" style="display: inline-block; background: #15564e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Gå till Medlemsområdet →
                </a>
            </div>
        </div>
        
        <div style="text-align: center; padding: 15px; color: #999; font-size: 12px;">
            Haggai Sweden | info@haggai.se
        </div>
    </body>
    </html>
    """
    
    for email in recipients:
        params = {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"📅 Kallelse: {meeting.get('title', 'Styrelsemöte')} - {meeting.get('date', '')}",
            "html": html_content
        }
        try:
            await asyncio.to_thread(resend.Emails.send, params)
            logging.info(f"Meeting invitation sent to {email}")
        except Exception as e:
            logging.error(f"Failed to send meeting invitation to {email}: {str(e)}")


async def send_meeting_reminder_email(meeting: dict, recipients: List[str], days_until: int):
    """Send meeting reminder to all board members"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); padding: 25px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">⏰ Påminnelse: Styrelsemöte om {days_until} dag{"ar" if days_until > 1 else ""}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #15564e; margin-top: 0;">{meeting.get("title", "Styrelsemöte")}</h2>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;">
                    <strong>📅 {meeting.get("date", "")}</strong> kl. <strong>{meeting.get("time", "")}</strong>
                </p>
                <p style="margin: 5px 0 0 0; color: #666;">
                    📍 {meeting.get("location", "Plats ej angiven")}
                </p>
            </div>
            
            <p>Glöm inte att förbereda dig inför mötet genom att gå igenom dagordningen.</p>
            
            <div style="margin-top: 25px; text-align: center;">
                <a href="https://peoplepotential.se/medlemmar" style="display: inline-block; background: #15564e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Se Dagordning →
                </a>
            </div>
        </div>
    </body>
    </html>
    """
    
    for email in recipients:
        params = {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"⏰ Påminnelse: {meeting.get('title', 'Styrelsemöte')} om {days_until} dag{'ar' if days_until > 1 else ''}",
            "html": html_content
        }
        try:
            await asyncio.to_thread(resend.Emails.send, params)
            logging.info(f"Meeting reminder sent to {email}")
        except Exception as e:
            logging.error(f"Failed to send meeting reminder to {email}: {str(e)}")


async def get_board_member_emails() -> List[str]:
    """Get all active board member emails"""
    members = await db.board_members.find(
        {"is_current": True, "email": {"$ne": None}}, 
        {"email": 1, "_id": 0}
    ).to_list(100)
    return [m["email"] for m in members if m.get("email")]


# ==================== CONTACT FORM ENDPOINTS ====================

@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(input: ContactCreate):
    """Submit a contact form"""
    submission = ContactSubmission(**input.model_dump())
    doc = submission.model_dump()
    await db.contact_submissions.insert_one(doc)
    return submission


@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    """Get all contact form submissions (admin)"""
    submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    return submissions


# ==================== MEMBERSHIP ENDPOINTS ====================

@api_router.post("/membership", response_model=MembershipApplication)
async def submit_membership(input: MembershipCreate):
    """Submit a membership application"""
    application = MembershipApplication(**input.model_dump())
    doc = application.model_dump()
    await db.membership_applications.insert_one(doc)
    return application


@api_router.get("/membership", response_model=List[MembershipApplication])
async def get_membership_applications():
    """Get all membership applications (admin)"""
    applications = await db.membership_applications.find({}, {"_id": 0}).to_list(1000)
    return applications


# ==================== LEADER EXPERIENCE APPLICATION ENDPOINTS ====================

@api_router.post("/leader-experience-applications", response_model=LeaderExperienceApplication)
async def submit_leader_experience_application(input: LeaderExperienceApplicationCreate):
    """Submit a Leader Experience application"""
    application = LeaderExperienceApplication(**input.model_dump())
    doc = application.model_dump()
    await db.leader_experience_applications.insert_one(doc)
    return application


@api_router.get("/leader-experience-applications", response_model=List[LeaderExperienceApplication])
async def get_leader_experience_applications():
    """Get all Leader Experience applications (admin)"""
    applications = await db.leader_experience_applications.find({}, {"_id": 0}).to_list(1000)
    return applications


@api_router.get("/leader-experience-applications/{program_id}")
async def get_applications_by_program(program_id: str):
    """Get applications for a specific program"""
    applications = await db.leader_experience_applications.find(
        {"program_id": program_id}, {"_id": 0}
    ).to_list(1000)
    return applications


@api_router.put("/leader-experience-applications/{application_id}")
async def update_leader_experience_application(application_id: str, update_data: dict):
    """Update a Leader Experience application (status, etc.)"""
    result = await db.leader_experience_applications.update_one(
        {"id": application_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    updated = await db.leader_experience_applications.find_one(
        {"id": application_id}, {"_id": 0}
    )
    return updated


# ==================== ORGANIZATION MEMBER ENDPOINTS ====================

@api_router.post("/organization-members", response_model=OrganizationMember)
async def create_organization_member(input: OrganizationMemberCreate):
    """Create a new organization member (church/organization)"""
    member = OrganizationMember(**input.model_dump())
    doc = member.model_dump()
    await db.organization_members.insert_one(doc)
    return member


@api_router.get("/organization-members", response_model=List[OrganizationMember])
async def get_organization_members(active_only: bool = True):
    """Get all organization members"""
    query = {"is_active": True} if active_only else {}
    members = await db.organization_members.find(query, {"_id": 0}).to_list(1000)
    return members


@api_router.get("/organization-members/{member_id}", response_model=OrganizationMember)
async def get_organization_member(member_id: str):
    """Get a specific organization member"""
    member = await db.organization_members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Organization member not found")
    return member


@api_router.put("/organization-members/{member_id}", response_model=OrganizationMember)
async def update_organization_member(member_id: str, update_data: dict):
    """Update an organization member"""
    result = await db.organization_members.update_one(
        {"id": member_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Organization member not found")
    
    updated = await db.organization_members.find_one({"id": member_id}, {"_id": 0})
    return updated


@api_router.delete("/organization-members/{member_id}")
async def delete_organization_member(member_id: str):
    """Delete an organization member"""
    result = await db.organization_members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Organization member not found")
    return {"message": "Organization member deleted successfully"}


# ==================== PARTNER ENDPOINTS ====================

@api_router.post("/partners", response_model=Partner)
async def create_partner(input: PartnerCreate):
    """Create a new partner"""
    partner = Partner(**input.model_dump())
    doc = partner.model_dump()
    await db.partners.insert_one(doc)
    return partner


@api_router.get("/partners", response_model=List[Partner])
async def get_partners(active_only: bool = True):
    """Get all partners"""
    query = {"is_active": True} if active_only else {}
    partners = await db.partners.find(query, {"_id": 0}).to_list(1000)
    return partners


@api_router.get("/partners/{partner_id}", response_model=Partner)
async def get_partner(partner_id: str):
    """Get a specific partner"""
    partner = await db.partners.find_one({"id": partner_id}, {"_id": 0})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return partner


@api_router.put("/partners/{partner_id}", response_model=Partner)
async def update_partner(partner_id: str, update_data: dict):
    """Update a partner"""
    result = await db.partners.update_one(
        {"id": partner_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    updated = await db.partners.find_one({"id": partner_id}, {"_id": 0})
    return updated


@api_router.delete("/partners/{partner_id}")
async def delete_partner(partner_id: str):
    """Delete a partner"""
    result = await db.partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted successfully"}


# ==================== TESTIMONIAL ENDPOINTS ====================

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(input: TestimonialCreate):
    """Create a new testimonial"""
    testimonial = Testimonial(**input.model_dump())
    doc = testimonial.model_dump()
    await db.testimonials.insert_one(doc)
    return testimonial


@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(active_only: bool = True):
    """Get all testimonials"""
    query = {"is_active": True} if active_only else {}
    testimonials = await db.testimonials.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return testimonials


@api_router.get("/testimonials/{testimonial_id}", response_model=Testimonial)
async def get_testimonial(testimonial_id: str):
    """Get a specific testimonial"""
    testimonial = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial


@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, update_data: dict):
    """Update a testimonial"""
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return updated


@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}


# ==================== NOMINATION ENDPOINTS ====================

class Nomination(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Event/Program info
    event_id: str
    event_title: str
    event_date: Optional[str] = None
    # Nominator info (the person nominating) - Optional for direct invitations
    nominator_name: Optional[str] = None
    nominator_email: Optional[str] = None
    nominator_phone: Optional[str] = None
    nominator_church: Optional[str] = None
    nominator_relation: Optional[str] = None
    # Nominee info (the person being nominated)
    nominee_name: str
    nominee_email: Optional[str] = None  # Can be filled during registration
    nominee_phone: Optional[str] = None
    nominee_church: Optional[str] = None
    nominee_role: Optional[str] = None
    nominee_activities: Optional[str] = None
    # Additional info
    motivation: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected, contacted, registered
    admin_notes: Optional[str] = None
    approved_at: Optional[str] = None
    approved_by: Optional[str] = None
    registration_completed: bool = False
    registration_data: Optional[dict] = None
    direct_invitation: bool = False  # True if created via simplified form
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class NomineeRegistrationData(BaseModel):
    profile_image: Optional[str] = None
    full_name: str
    gender: str
    date_of_birth: str
    phone: str
    email: str
    full_address: str
    marital_status: str
    place_of_birth: str
    work_field: str
    current_profession: str
    employer_name: str
    church_name: str
    church_role: str
    commitment_attendance: str
    commitment_active_role: str
    fee_support_request: Optional[str] = None
    notes: Optional[str] = None


class NominationCreate(BaseModel):
    event_id: str
    event_title: str
    event_date: Optional[str] = None
    nominator_name: Optional[str] = None  # Optional for direct invitations
    nominator_email: Optional[str] = None  # Optional for direct invitations
    nominator_phone: Optional[str] = None
    nominator_church: Optional[str] = None
    nominator_relation: Optional[str] = None
    nominee_name: str
    nominee_email: Optional[str] = None  # Optional - can be filled during registration
    nominee_phone: Optional[str] = None
    nominee_church: Optional[str] = None
    nominee_role: Optional[str] = None
    nominee_activities: Optional[str] = None
    motivation: Optional[str] = None
    status: Optional[str] = None  # Allow setting status on creation
    direct_invitation: Optional[bool] = False  # Flag for direct invitations


class NominationUpdate(BaseModel):
    status: Optional[str] = None
    motivation: Optional[str] = None
    admin_notes: Optional[str] = None


# ==================== EMAIL FUNCTIONS ====================

async def send_nomination_email_to_nominee(nomination: Nomination):
    """Send email to the nominated person with registration link"""
    # Get the frontend URL from env or use default
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    registration_link = f"{frontend_url}/registrering/{nomination.id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #15564e 0%, #0f403a 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Du har blivit nominerad!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Haggai Sweden Leadership Program</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <p style="font-size: 16px;">Hej <strong>{nomination.nominee_name}</strong>,</p>
            
            <p>Vi vill informera dig om att <strong>{nomination.nominator_name}</strong> har nominerat dig till följande ledarprogram:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #15564e; margin: 20px 0;">
                <h3 style="color: #15564e; margin: 0 0 10px 0;">{nomination.event_title}</h3>
                {f'<p style="color: #666; margin: 0;"><strong>Datum:</strong> {nomination.event_date}</p>' if nomination.event_date else ''}
            </div>
            
            <h3 style="color: #15564e;">Motivering från {nomination.nominator_name}:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap;">
{nomination.motivation if nomination.motivation else 'Ingen motivering angavs.'}
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p style="font-size: 18px; font-weight: bold; color: #15564e;">Registrera dig för programmet</p>
                <p>Klicka på knappen nedan för att fylla i registreringsformuläret:</p>
                <a href="{registration_link}" style="display: inline-block; background: linear-gradient(135deg, #15564e 0%, #0f403a 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 20px 0;">
                    Registrera dig nu →
                </a>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">
                    Eller kopiera denna länk:<br>
                    <a href="{registration_link}" style="color: #15564e; word-break: break-all;">{registration_link}</a>
                </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 14px; margin: 0;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
                <p style="color: #999; font-size: 12px; margin-top: 10px;">
                    <a href="https://peoplepotential.se" style="color: #15564e;">peoplepotential.se</a> | 
                    <a href="mailto:info@haggai.se" style="color: #15564e;">info@haggai.se</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [nomination.nominee_email],
        "subject": f"Du har blivit nominerad till {nomination.event_title}",
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Nomination email sent to nominee {nomination.nominee_email}, id: {email.get('id')}")
        return True
    except Exception as e:
        logging.error(f"Failed to send email to nominee: {str(e)}")
        return False


async def send_nomination_email_to_admin(nomination: Nomination):
    """Send notification email to admin about new nomination"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #15564e; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🔔 Ny nominering mottagen</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 25px; border: 1px solid #ddd; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; background: #e8f5e9; border-radius: 8px;">
                        <strong style="color: #2e7d32;">Nominerad person:</strong><br>
                        <span style="font-size: 18px;">{nomination.nominee_name}</span><br>
                        <a href="mailto:{nomination.nominee_email}" style="color: #15564e;">{nomination.nominee_email}</a>
                        {f'<br><span style="color: #666;">{nomination.nominee_phone}</span>' if nomination.nominee_phone else ''}
                    </td>
                </tr>
                <tr><td style="height: 15px;"></td></tr>
                <tr>
                    <td style="padding: 10px; background: #e3f2fd; border-radius: 8px;">
                        <strong style="color: #1565c0;">Nominerad av:</strong><br>
                        <span style="font-size: 16px;">{nomination.nominator_name}</span><br>
                        <a href="mailto:{nomination.nominator_email}" style="color: #15564e;">{nomination.nominator_email}</a>
                        {f'<br><span style="color: #666;">{nomination.nominator_phone}</span>' if nomination.nominator_phone else ''}
                    </td>
                </tr>
                <tr><td style="height: 15px;"></td></tr>
                <tr>
                    <td style="padding: 10px; background: #fff3e0; border-radius: 8px;">
                        <strong style="color: #e65100;">Utbildning:</strong><br>
                        <span style="font-size: 16px;">{nomination.event_title}</span>
                        {f'<br><span style="color: #666;">Datum: {nomination.event_date}</span>' if nomination.event_date else ''}
                    </td>
                </tr>
            </table>
            
            {f'''
            <div style="margin-top: 20px;">
                <strong>Motivering:</strong>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 10px; white-space: pre-wrap; font-size: 14px;">
{nomination.motivation}
                </div>
            </div>
            ''' if nomination.motivation else ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <a href="https://peoplepotential.se/admin/nomineringar" style="display: inline-block; background: #15564e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Visa i Admin-panelen →
                </a>
            </div>
        </div>
        
        <div style="text-align: center; padding: 15px; color: #999; font-size: 12px;">
            Detta är ett automatiskt meddelande från Haggai Sweden nomineringssystem
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [ADMIN_EMAIL],
        "subject": f"Ny nominering: {nomination.nominee_name} → {nomination.event_title}",
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Nomination notification sent to admin {ADMIN_EMAIL}, id: {email.get('id')}")
        return True
    except Exception as e:
        logging.error(f"Failed to send email to admin: {str(e)}")
        return False


@api_router.post("/nominations", response_model=Nomination)
async def create_nomination(input: NominationCreate):
    """Create a new nomination - direct invitations are auto-approved"""
    nomination = Nomination(**input.model_dump())
    
    # Check if this is a direct invitation (simplified form)
    if input.direct_invitation or input.status == 'approved':
        nomination.status = "approved"  # Auto-approve for direct invitations
        nomination.direct_invitation = True
    else:
        nomination.status = "pending"  # Needs admin review
    
    doc = nomination.model_dump()
    await db.nominations.insert_one(doc)
    
    # Only send emails for traditional nominations (not direct invitations)
    if not input.direct_invitation and input.status != 'approved':
        # Notify admin about new nomination
        asyncio.create_task(send_nomination_email_to_admin(nomination))
        
        # Send confirmation to nominator if they provided an email
        if nomination.nominator_email:
            asyncio.create_task(send_nomination_confirmation_to_nominator(nomination))
    
    return nomination


async def send_nomination_confirmation_to_nominator(nomination: Nomination):
    """Send confirmation email to the person who submitted the nomination"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Nominering mottagen</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{nomination.nominator_name}</strong>,</p>
            
            <p>Tack för din nominering av <strong>{nomination.nominee_name}</strong> till <strong>{nomination.event_title}</strong>!</p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #014D73; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Vad händer nu?</p>
                <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Din nominering granskas av vårt team</li>
                    <li>Om nomineringen godkänns skickas en inbjudan till {nomination.nominee_name}</li>
                    <li>Du får ett meddelande när nomineringen har behandlats</li>
                </ol>
            </div>
            
            <p>Om du har några frågor är du välkommen att kontakta oss.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [nomination.nominator_email],
            "subject": f"✅ Din nominering av {nomination.nominee_name} har mottagits",
            "html": html_content
        })
    except Exception as e:
        logging.error(f"Failed to send nominator confirmation: {str(e)}")


@api_router.get("/nominations", response_model=List[Nomination])
async def get_nominations(status: Optional[str] = None, event_id: Optional[str] = None):
    """Get all nominations with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if event_id:
        query["event_id"] = event_id
    nominations = await db.nominations.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return nominations


@api_router.get("/nominations/stats")
async def get_nomination_stats():
    """Get nomination statistics"""
    total = await db.nominations.count_documents({})
    pending = await db.nominations.count_documents({"status": "pending"})
    approved = await db.nominations.count_documents({"status": "approved"})
    rejected = await db.nominations.count_documents({"status": "rejected"})
    contacted = await db.nominations.count_documents({"status": "contacted"})
    
    # Get top nominators
    pipeline = [
        {"$group": {"_id": "$nominator_email", "count": {"$sum": 1}, "name": {"$first": "$nominator_name"}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_nominators = await db.nominations.aggregate(pipeline).to_list(10)
    
    # Get nominations by event
    event_pipeline = [
        {"$group": {"_id": "$event_title", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_event = await db.nominations.aggregate(event_pipeline).to_list(100)
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "contacted": contacted,
        "top_nominators": top_nominators,
        "by_event": by_event
    }


@api_router.get("/nominations/{nomination_id}", response_model=Nomination)
async def get_nomination(nomination_id: str):
    """Get a specific nomination"""
    nomination = await db.nominations.find_one({"id": nomination_id}, {"_id": 0})
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    return nomination


@api_router.put("/nominations/{nomination_id}", response_model=Nomination)
async def update_nomination(nomination_id: str, input: NominationUpdate):
    """Update a nomination status"""
    existing = await db.nominations.find_one({"id": nomination_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.nominations.update_one({"id": nomination_id}, {"$set": update_data})
    updated = await db.nominations.find_one({"id": nomination_id}, {"_id": 0})
    return updated


@api_router.delete("/nominations/{nomination_id}")
async def delete_nomination(nomination_id: str):
    """Delete a nomination"""
    result = await db.nominations.delete_one({"id": nomination_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Nomination not found")
    return {"message": "Nomination deleted successfully"}


@api_router.post("/nominations/{nomination_id}/approve")
async def approve_nomination(nomination_id: str, admin_notes: Optional[str] = None):
    """Approve a nomination and send invitation to the nominee"""
    nomination = await db.nominations.find_one({"id": nomination_id})
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    if nomination.get("status") == "approved":
        raise HTTPException(status_code=400, detail="Nomination already approved")
    
    # Update nomination status
    update_data = {
        "status": "approved",
        "approved_at": datetime.now(timezone.utc).isoformat(),
        "admin_notes": admin_notes,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": nomination_id}, {"$set": update_data})
    
    # Create nomination object for email
    nomination_obj = Nomination(**{**nomination, **update_data})
    
    # Send invitation email to nominee
    await send_nomination_invitation_to_nominee(nomination_obj)
    
    # Notify nominator that their nomination was approved
    await send_nomination_approved_to_nominator(nomination_obj)
    
    updated = await db.nominations.find_one({"id": nomination_id}, {"_id": 0})
    return updated


@api_router.post("/nominations/{nomination_id}/reject")
async def reject_nomination(nomination_id: str, reason: Optional[str] = None):
    """Reject a nomination"""
    nomination = await db.nominations.find_one({"id": nomination_id})
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    # Update nomination status
    update_data = {
        "status": "rejected",
        "admin_notes": reason,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": nomination_id}, {"$set": update_data})
    
    # Optionally notify nominator
    # await send_nomination_rejected_to_nominator(nomination, reason)
    
    updated = await db.nominations.find_one({"id": nomination_id}, {"_id": 0})
    return updated


async def send_nomination_invitation_to_nominee(nomination: Nomination):
    """Send invitation email to the nominated person after admin approval"""
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    registration_link = f"{frontend_url}/registrering/{nomination.id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎓 Du har blivit nominerad!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej <strong>{nomination.nominee_name}</strong>,</p>
            
            <p><strong>{nomination.nominator_name}</strong> har nominerat och rekommenderat dig att delta i ett värdefullt ledarprogram:</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #014D73; margin: 20px 0;">
                <h2 style="color: #014D73; margin: 0 0 10px 0; font-size: 20px;">{nomination.event_title}</h2>
                {f'<p style="color: #666; margin: 0;"><strong>Datum:</strong> {nomination.event_date}</p>' if nomination.event_date else ''}
            </div>
            
            <h3 style="color: #014D73;">Om Haggai International</h3>
            <p>Haggai International är en global organisation som utbildar kristna ledare från hela världen. Programmet utmärker sig genom sin ekumeniska karaktär, där det samlar ledare från olika kyrkor och samfund utan att tillhöra någon specifik kyrka.</p>
            
            <p>Målet är att utrusta dig med:</p>
            <ul>
                <li>Praktiska ledarskapsverktyg</li>
                <li>En bredare vision för din tjänst</li>
                <li>Ett internationellt nätverk av kristna ledare</li>
                <li>Personlig och andlig tillväxt</li>
            </ul>
            
            {f'''<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #2e7d32;">Motivering från {nomination.nominator_name}:</p>
                <p style="margin: 10px 0 0 0; font-style: italic; color: #555;">{nomination.motivation}</p>
            </div>''' if nomination.motivation else ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{registration_link}" style="display: inline-block; background: #014D73; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Registrera dig nu
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Om du har frågor om programmet, kontakta oss gärna.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
                <p><a href="https://peoplepotential.se" style="color: #014D73;">peoplepotential.se</a> | <a href="mailto:info@haggai.se" style="color: #014D73;">info@haggai.se</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [nomination.nominee_email],
            "subject": f"🎓 {nomination.nominator_name} har nominerat dig till {nomination.event_title}",
            "html": html_content
        })
        logging.info(f"Invitation email sent to nominee: {nomination.nominee_email}")
    except Exception as e:
        logging.error(f"Failed to send invitation to nominee: {str(e)}")


async def send_nomination_approved_to_nominator(nomination: Nomination):
    """Notify nominator that their nomination was approved"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Nominering godkänd!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{nomination.nominator_name}</strong>,</p>
            
            <p>Goda nyheter! Din nominering av <strong>{nomination.nominee_name}</strong> till <strong>{nomination.event_title}</strong> har godkänts.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #2e7d32; margin: 20px 0;">
                <p style="margin: 0;">Vi har nu skickat en inbjudan till {nomination.nominee_name} med information om programmet och en länk för att registrera sig.</p>
            </div>
            
            <p>Tack för att du hjälper till att identifiera och uppmuntra framtida ledare!</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [nomination.nominator_email],
            "subject": f"✅ Din nominering av {nomination.nominee_name} har godkänts!",
            "html": html_content
        })
    except Exception as e:
        logging.error(f"Failed to send approval notification to nominator: {str(e)}")


@api_router.post("/nominations/{nomination_id}/register")
async def register_nominee(nomination_id: str, registration: NomineeRegistrationData):
    """Register a nominee with their full registration data"""
    # Find the nomination
    nomination = await db.nominations.find_one({"id": nomination_id})
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    # Check if already registered
    if nomination.get("registration_completed"):
        raise HTTPException(status_code=400, detail="Already registered")
    
    # Update nomination with registration data
    update_data = {
        "registration_completed": True,
        "registration_data": registration.model_dump(),
        "status": "pending_approval",  # Changed from "registered" to "pending_approval"
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": nomination_id}, {"$set": update_data})
    
    # Send notification email to admin about the registration
    try:
        await send_registration_email_to_admin(nomination, registration)
    except Exception as e:
        logging.error(f"Failed to send registration email: {e}")
    
    return {"message": "Registration completed successfully", "nomination_id": nomination_id}


class RegistrationApproval(BaseModel):
    action: str  # "approve" or "reject"
    rejection_reason: Optional[str] = None


@api_router.post("/nominations/{nomination_id}/approve-registration")
async def approve_or_reject_registration(nomination_id: str, approval: RegistrationApproval):
    """Admin approves or rejects a participant's registration"""
    nomination = await db.nominations.find_one({"id": nomination_id})
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    if not nomination.get("registration_completed"):
        raise HTTPException(status_code=400, detail="No registration to approve")
    
    registration_data = nomination.get("registration_data", {})
    
    if approval.action == "approve":
        # Create participant account
        participant_account = await create_participant_account(nomination, registration_data)
        
        # Update nomination status
        await db.nominations.update_one(
            {"id": nomination_id},
            {"$set": {
                "status": "approved",
                "participant_id": participant_account['id'],
                "approved_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Send approval email with login credentials
        await send_participant_approval_email(
            registration_data.get("email", nomination.get("nominee_email")),
            registration_data.get("full_name", nomination.get("nominee_name")),
            participant_account['password'],
            nomination.get("event_title", "Haggai Workshop")
        )
        
        return {"success": True, "message": "Registration approved", "participant_id": participant_account['id']}
    
    elif approval.action == "reject":
        # Update nomination status
        await db.nominations.update_one(
            {"id": nomination_id},
            {"$set": {
                "status": "rejected",
                "rejection_reason": approval.rejection_reason,
                "rejected_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Send rejection email
        await send_participant_rejection_email(
            registration_data.get("email", nomination.get("nominee_email")),
            registration_data.get("full_name", nomination.get("nominee_name")),
            approval.rejection_reason or "Inga ytterligare detaljer tillhandahållna",
            nomination.get("event_title", "Haggai Workshop")
        )
        
        return {"success": True, "message": "Registration rejected"}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid action")


async def create_participant_account(nomination: dict, registration_data: dict):
    """Create a participant account with login access"""
    email = registration_data.get("email", nomination.get("nominee_email"))
    
    if not email:
        raise HTTPException(status_code=400, detail="Email not found")
    
    # Check if participant already exists
    existing = await db.participants.find_one({"email": email})
    if existing:
        return existing
    
    # Generate password
    password = generate_password()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    participant = {
        "id": str(uuid.uuid4()),
        "nomination_id": nomination.get("id"),
        "email": email,
        "password_hash": password_hash,
        "full_name": registration_data.get("full_name", nomination.get("nominee_name", "")),
        "phone": registration_data.get("phone", ""),
        "gender": registration_data.get("gender", ""),
        "date_of_birth": registration_data.get("date_of_birth", ""),
        "church_name": registration_data.get("church_name", ""),
        "church_role": registration_data.get("church_role", ""),
        "profile_image": registration_data.get("profile_image"),
        "workshop_id": nomination.get("event_id"),
        "workshop_title": nomination.get("event_title", ""),
        "attendance_hours": 0,
        "diploma_received": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True,
        "password": password  # Store temporarily to send in email
    }
    
    # Don't store plain password in DB
    temp_password = participant.pop("password")
    
    await db.participants.insert_one(participant)
    
    # Return with password for email
    participant["password"] = temp_password
    return participant


async def send_participant_approval_email(email: str, name: str, password: str, workshop_title: str):
    """Send approval email to participant with login credentials"""
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Din registrering är godkänd!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Välkommen till {workshop_title}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{name}</strong>,</p>
            
            <p>Grattis! Din registrering för <strong>{workshop_title}</strong> har godkänts.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #2e7d32; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">Dina inloggningsuppgifter</h3>
                <p style="margin: 5px 0;"><strong>E-post:</strong> {email}</p>
                <p style="margin: 5px 0;"><strong>Lösenord:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-size: 16px;">{password}</code></p>
            </div>
            
            <p><strong>Som deltagare kan du nu:</strong></p>
            <ul>
                <li>📛 Ladda ner din namnbricka</li>
                <li>📅 Se workshop-agenda och schema</li>
                <li>ℹ️ Få tillgång till workshop-information</li>
                <li>👤 Hantera din profil</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{frontend_url}/deltagare/login" style="display: inline-block; background: #15564e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Logga in till din portal →
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Vi ser fram emot att ha dig med på workshopen!</p>
            
            <p>Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"✅ Godkänd för {workshop_title} - Dina inloggningsuppgifter",
            "html": html_content
        })
        logging.info(f"Approval email sent to participant {email}")
    except Exception as e:
        logging.error(f"Failed to send approval email: {str(e)}")


async def send_participant_rejection_email(email: str, name: str, reason: str, workshop_title: str):
    """Send rejection email to participant"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Angående din registrering</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">{workshop_title}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{name}</strong>,</p>
            
            <p>Tack för din registrering för <strong>{workshop_title}</strong>.</p>
            
            <p>Tyvärr kan vi just nu inte godkänna din registrering.</p>
            
            <div style="background: #fee; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <h4 style="color: #dc2626; margin-top: 0;">Anledning:</h4>
                <p style="margin: 0;">{reason}</p>
            </div>
            
            <p>Om du har frågor eller vill diskutera detta vidare, tveka inte att kontakta oss.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"Angående din registrering för {workshop_title}",
            "html": html_content
        })
        logging.info(f"Rejection email sent to {email}")
    except Exception as e:
        logging.error(f"Failed to send rejection email: {str(e)}")



async def send_registration_email_to_admin(nomination: dict, registration: NomineeRegistrationData):
    """Send notification email to admin when nominee registers"""
    if not resend.api_key:
        logging.warning("Resend API key not configured, skipping email")
        return
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Ny registrering mottagen!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">En nominerad person har registrerat sig</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <h3 style="color: #15564e; margin-top: 0;">Program</h3>
            <p><strong>{nomination.get('event_title', 'N/A')}</strong></p>
            
            <h3 style="color: #15564e;">Personuppgifter</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Namn:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.full_name}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Kön:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.gender}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Födelsedatum:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.date_of_birth}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Telefon:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.phone}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>E-post:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.email}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Adress:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.full_address}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Civilstånd:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.marital_status}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Födelseort:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.place_of_birth}</td></tr>
            </table>
            
            <h3 style="color: #15564e;">Arbetsinformation</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Arbetsområde:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.work_field}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Yrke:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.current_profession}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Arbetsgivare:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.employer_name}</td></tr>
            </table>
            
            <h3 style="color: #15564e;">Kyrkoinformation</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Kyrka:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.church_name}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Roll i kyrkan:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{registration.church_role}</td></tr>
            </table>
            
            <h3 style="color: #15564e;">Åtaganden</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Närvaroåtagande:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{'✅ Åtar sig' if registration.commitment_attendance == 'yes' else '❌ Åtar sig inte'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Aktivt deltagande:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{'✅ Ja' if registration.commitment_active_role == 'yes' else '❌ Nej'}</td></tr>
            </table>
            
            {f'<h3 style="color: #15564e;">Ekonomiskt stöd</h3><p>{registration.fee_support_request}</p>' if registration.fee_support_request else ''}
            
            {f'<h3 style="color: #15564e;">Övriga kommentarer</h3><p>{registration.notes}</p>' if registration.notes else ''}
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
                <p style="margin: 0; color: #2e7d32;"><strong>Nominerad av:</strong> {nomination.get('nominator_name', 'N/A')} ({nomination.get('nominator_email', 'N/A')})</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        email = resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"✅ Ny registrering: {registration.full_name} - {nomination.get('event_title', 'N/A')}",
            "html": html_content
        })
        logging.info(f"Registration email sent to admin, id: {email.get('id')}")
    except Exception as e:
        logging.error(f"Failed to send registration email to admin: {e}")


# ==================== BOARD MEETING ENDPOINTS ====================

class AgendaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    responsible: Optional[str] = None
    status: str = "pending"  # pending, discussed, decided, postponed
    notes: Optional[str] = None
    decision: Optional[str] = None


class BoardMeeting(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    date: str  # ISO format date
    time: Optional[str] = None
    location: Optional[str] = None
    agenda_items: List[AgendaItem] = []
    attendees: List[str] = []
    minutes: Optional[str] = None  # Meeting minutes/notes
    status: str = "scheduled"  # scheduled, in_progress, completed, archived
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BoardMeetingCreate(BaseModel):
    title: str
    date: str
    time: Optional[str] = None
    location: Optional[str] = None
    agenda_items: List[dict] = []
    attendees: List[str] = []


class BoardMeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    agenda_items: Optional[List[dict]] = None
    attendees: Optional[List[str]] = None
    minutes: Optional[str] = None
    status: Optional[str] = None


# ==================== WORKSHOP MODELS ====================

class Workshop(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    workshop_type: str  # 'international', 'national', 'online', 'tot'
    target_gender: str = "all"  # 'all', 'women', 'men'
    language: Optional[str] = None
    date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    location_en: Optional[str] = None
    location_ar: Optional[str] = None
    spots: Optional[int] = None
    spots_left: Optional[int] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    price: Optional[float] = 500  # Default price 500 kr
    currency: str = "SEK"  # SEK or USD
    is_online: bool = False
    is_tot: bool = False  # Training of Trainers (FDS)
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class WorkshopCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    workshop_type: str
    target_gender: str = "all"
    language: Optional[str] = None
    date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    location_en: Optional[str] = None
    location_ar: Optional[str] = None
    spots: Optional[int] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    price: float = 500
    currency: str = "SEK"
    is_online: bool = False
    is_tot: bool = False


class WorkshopUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    workshop_type: Optional[str] = None
    target_gender: Optional[str] = None
    language: Optional[str] = None
    date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    location_en: Optional[str] = None
    location_ar: Optional[str] = None
    spots: Optional[int] = None
    spots_left: Optional[int] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    is_online: Optional[bool] = None
    is_tot: Optional[bool] = None
    is_active: Optional[bool] = None


# ==================== SESSION EVALUATION MODELS ====================

class EvaluationQuestion(BaseModel):
    """A question used in session evaluations"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text_sv: str  # Swedish text
    text_en: Optional[str] = None  # English text
    text_ar: Optional[str] = None  # Arabic text
    description_sv: Optional[str] = None  # Optional helper text
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None


class EvaluationQuestionCreate(BaseModel):
    text_sv: str
    text_en: Optional[str] = None
    text_ar: Optional[str] = None
    description_sv: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    is_active: bool = True
    order: int = 0


class EvaluationQuestionUpdate(BaseModel):
    text_sv: Optional[str] = None
    text_en: Optional[str] = None
    text_ar: Optional[str] = None
    description_sv: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class EvaluationAnswer(BaseModel):
    """Answer to a single evaluation question"""
    question_id: str
    rating: int  # 1-10


class SessionEvaluation(BaseModel):
    """A participant's evaluation of a session leader"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workshop_id: str
    session_id: str
    leader_id: str
    leader_name: Optional[str] = None  # Cached for display
    session_title: Optional[str] = None  # Cached
    participant_id: Optional[str] = None  # For tracking (hidden from leader)
    participant_email: Optional[str] = None  # For tracking
    answers: List[EvaluationAnswer] = []
    comment: Optional[str] = None  # Optional free text comment
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SessionEvaluationCreate(BaseModel):
    workshop_id: str
    session_id: str
    leader_id: str
    answers: List[EvaluationAnswer]
    comment: Optional[str] = None
    participant_email: Optional[str] = None  # Optional identifier


class LeaderFeedback(BaseModel):
    """Feedback sent to a leader by admin"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    leader_id: str
    leader_email: Optional[str] = None
    workshop_id: Optional[str] = None
    session_id: Optional[str] = None
    feedback_type: str  # "praise", "improvement", "general"
    subject: str
    message: str
    statistics_summary: Optional[dict] = None  # Include stats in feedback
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    sent_by: Optional[str] = None  # Admin who sent


class LeaderFeedbackCreate(BaseModel):
    leader_id: str
    workshop_id: Optional[str] = None
    session_id: Optional[str] = None
    feedback_type: str = "general"
    subject: str
    message: str
    include_statistics: bool = True


# ==================== WORKSHOP AGENDA MODELS ====================

class AgendaSession(BaseModel):
    """A single session in a workshop agenda"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_time: str  # "09:00"
    end_time: str    # "10:00"
    title: str
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    leader_id: Optional[str] = None  # Reference to leader
    leader_name: Optional[str] = None  # Cached for display
    session_type: str = "session"  # "session", "break", "lunch", "registration", "other"
    order: int = 0


class AgendaDay(BaseModel):
    """A day in the workshop agenda"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str  # "2026-03-15"
    day_number: int  # 1, 2, 3...
    title: Optional[str] = None  # "Dag 1 - Introduktion"
    sessions: List[AgendaSession] = []


class WorkshopAgenda(BaseModel):
    """Complete agenda for a workshop"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workshop_id: str
    workshop_title: Optional[str] = None  # Cached
    days: List[AgendaDay] = []
    is_published: bool = False  # When true, participants can see it
    notify_participants: bool = True  # Send notifications
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AgendaSessionCreate(BaseModel):
    start_time: str
    end_time: str
    title: str
    title_en: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    leader_id: Optional[str] = None
    session_type: str = "session"
    order: int = 0


class AgendaDayCreate(BaseModel):
    date: str
    day_number: int
    title: Optional[str] = None
    sessions: List[AgendaSessionCreate] = []


class WorkshopAgendaCreate(BaseModel):
    workshop_id: str
    days: List[AgendaDayCreate] = []
    is_published: bool = False
    notify_participants: bool = True


class WorkshopAgendaUpdate(BaseModel):
    days: Optional[List[AgendaDayCreate]] = None
    is_published: Optional[bool] = None
    notify_participants: Optional[bool] = None


@api_router.post("/board-meetings", response_model=BoardMeeting)
async def create_board_meeting(input: BoardMeetingCreate, send_invitation: bool = True):
    """Create a new board meeting and optionally send invitations"""
    # Convert agenda items to AgendaItem objects
    agenda_items = [AgendaItem(**item) if isinstance(item, dict) else item for item in input.agenda_items]
    
    meeting = BoardMeeting(
        title=input.title,
        date=input.date,
        time=input.time,
        location=input.location,
        agenda_items=agenda_items,
        attendees=input.attendees
    )
    doc = meeting.model_dump()
    await db.board_meetings.insert_one(doc)
    
    # Send invitation emails to all board members
    if send_invitation:
        board_emails = await get_board_member_emails()
        if board_emails:
            asyncio.create_task(send_meeting_invitation_email(doc, board_emails))
    
    return meeting


@api_router.get("/board-meetings", response_model=List[BoardMeeting])
async def get_board_meetings(status: Optional[str] = None, archived: bool = False):
    """Get all board meetings"""
    query = {}
    if status:
        query["status"] = status
    elif archived:
        query["status"] = "archived"
    else:
        query["status"] = {"$ne": "archived"}
    
    meetings = await db.board_meetings.find(query, {"_id": 0}).sort("date", -1).to_list(100)
    return meetings


@api_router.get("/board-meetings/archived", response_model=List[BoardMeeting])
async def get_archived_meetings():
    """Get all archived board meetings"""
    meetings = await db.board_meetings.find({"status": "archived"}, {"_id": 0}).sort("date", -1).to_list(100)
    return meetings


@api_router.get("/board-meetings/{meeting_id}", response_model=BoardMeeting)
async def get_board_meeting(meeting_id: str):
    """Get a specific board meeting"""
    meeting = await db.board_meetings.find_one({"id": meeting_id}, {"_id": 0})
    if not meeting:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    return meeting


@api_router.put("/board-meetings/{meeting_id}", response_model=BoardMeeting)
async def update_board_meeting(meeting_id: str, input: BoardMeetingUpdate):
    """Update a board meeting"""
    existing = await db.board_meetings.find_one({"id": meeting_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    # Handle agenda items conversion
    if "agenda_items" in update_data and update_data["agenda_items"]:
        update_data["agenda_items"] = [
            AgendaItem(**item).model_dump() if isinstance(item, dict) and "id" not in item 
            else (AgendaItem(**item).model_dump() if isinstance(item, dict) else item)
            for item in update_data["agenda_items"]
        ]
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.board_meetings.update_one({"id": meeting_id}, {"$set": update_data})
    updated = await db.board_meetings.find_one({"id": meeting_id}, {"_id": 0})
    return updated


@api_router.put("/board-meetings/{meeting_id}/archive")
async def archive_board_meeting(meeting_id: str):
    """Archive a board meeting"""
    existing = await db.board_meetings.find_one({"id": meeting_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    
    await db.board_meetings.update_one(
        {"id": meeting_id}, 
        {"$set": {"status": "archived", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Board meeting archived successfully"}


@api_router.delete("/board-meetings/{meeting_id}")
async def delete_board_meeting(meeting_id: str):
    """Delete a board meeting"""
    result = await db.board_meetings.delete_one({"id": meeting_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    return {"message": "Board meeting deleted successfully"}


@api_router.post("/board-meetings/{meeting_id}/send-invitation")
async def send_meeting_invitation(meeting_id: str):
    """Send invitation emails for a specific meeting"""
    meeting = await db.board_meetings.find_one({"id": meeting_id}, {"_id": 0})
    if not meeting:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    
    board_emails = await get_board_member_emails()
    if not board_emails:
        return {"message": "Inga styrelsemedlemmar med e-post hittades", "sent_to": 0}
    
    await send_meeting_invitation_email(meeting, board_emails)
    return {"message": f"Kallelse skickad till {len(board_emails)} styrelsemedlemmar", "sent_to": len(board_emails)}


@api_router.post("/board-meetings/{meeting_id}/send-reminder")
async def send_meeting_reminder(meeting_id: str, days_until: int = 1):
    """Send reminder emails for a specific meeting"""
    meeting = await db.board_meetings.find_one({"id": meeting_id}, {"_id": 0})
    if not meeting:
        raise HTTPException(status_code=404, detail="Board meeting not found")
    
    board_emails = await get_board_member_emails()
    if not board_emails:
        return {"message": "Inga styrelsemedlemmar med e-post hittades", "sent_to": 0}
    
    await send_meeting_reminder_email(meeting, board_emails, days_until)
    return {"message": f"Påminnelse skickad till {len(board_emails)} styrelsemedlemmar", "sent_to": len(board_emails)}


# ==================== WORKSHOP ENDPOINTS ====================

@api_router.post("/workshops", response_model=Workshop)
async def create_workshop(input: WorkshopCreate):
    """Create a new workshop"""
    workshop = Workshop(**input.model_dump())
    workshop.spots_left = input.spots  # Initialize spots_left
    doc = workshop.model_dump()
    await db.workshops.insert_one(doc)
    return workshop


@api_router.get("/workshops")
async def get_workshops(active_only: bool = True, workshop_type: Optional[str] = None):
    """Get all workshops"""
    query = {}
    if active_only:
        query["is_active"] = True
    if workshop_type:
        query["workshop_type"] = workshop_type
    
    workshops = await db.workshops.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return workshops


@api_router.get("/workshops/{workshop_id}")
async def get_workshop(workshop_id: str):
    """Get a specific workshop"""
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return workshop


@api_router.put("/workshops/{workshop_id}")
async def update_workshop(workshop_id: str, input: WorkshopUpdate):
    """Update a workshop (including price)"""
    existing = await db.workshops.find_one({"id": workshop_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.workshops.update_one({"id": workshop_id}, {"$set": update_data})
    updated = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    return updated


@api_router.delete("/workshops/{workshop_id}")
async def delete_workshop(workshop_id: str):
    """Delete a workshop"""
    result = await db.workshops.delete_one({"id": workshop_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return {"message": "Workshop deleted successfully"}


@api_router.post("/workshops/seed-initial")
async def seed_initial_workshops():
    """Seed initial workshops from the specification"""
    # Check if workshops already exist
    count = await db.workshops.count_documents({})
    if count > 0:
        return {"message": "Workshops already exist", "count": count}
    
    initial_workshops = [
        {
            "id": str(uuid.uuid4()),
            "title": "Workshop – Kvinnor internationell",
            "title_en": "Workshop – Women International",
            "title_ar": "ورشة عمل – نساء دولية",
            "description": "Internationell workshop för kvinnor i ledande positioner. 2 platser från Sverige.",
            "description_en": "International workshop for women in leadership positions. 2 spots from Sweden.",
            "description_ar": "ورشة عمل دولية للنساء في المناصب القيادية. مقعدان من السويد.",
            "workshop_type": "international",
            "target_gender": "women",
            "date": "2026-07-13",
            "end_date": "2026-07-26",
            "location": "Internationell plats",
            "location_en": "International location",
            "location_ar": "موقع دولي",
            "spots": 2,
            "spots_left": 2,
            "age_min": 23,
            "age_max": 55,
            "price": 500,
            "currency": "USD",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Workshop – Män internationell",
            "title_en": "Workshop – Men International",
            "title_ar": "ورشة عمل – رجال دولية",
            "description": "Internationell workshop för män i ledande positioner. 2 platser från Sverige.",
            "description_en": "International workshop for men in leadership positions. 2 spots from Sweden.",
            "description_ar": "ورشة عمل دولية للرجال في المناصب القيادية. مقعدان من السويد.",
            "workshop_type": "international",
            "target_gender": "men",
            "date": "2026-11-30",
            "end_date": "2026-12-11",
            "location": "Internationell plats",
            "location_en": "International location",
            "location_ar": "موقع دولي",
            "spots": 2,
            "spots_left": 2,
            "age_min": 23,
            "age_max": 55,
            "price": 500,
            "currency": "USD",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Workshop – Online engelskspråkig internationell",
            "title_en": "Workshop – Online English International",
            "title_ar": "ورشة عمل – عبر الإنترنت بالإنجليزية دولية",
            "description": "Online workshop på engelska. Ålder: 29-60 år.",
            "description_en": "Online workshop in English. Age: 29-60 years.",
            "description_ar": "ورشة عمل عبر الإنترنت بالإنجليزية. العمر: 29-60 سنة.",
            "workshop_type": "online",
            "target_gender": "all",
            "language": "english",
            "date": "2026-02-05",
            "end_date": "2026-02-07",
            "location": "Online",
            "location_en": "Online",
            "location_ar": "عبر الإنترنت",
            "spots": None,
            "spots_left": None,
            "age_min": 29,
            "age_max": 60,
            "price": 500,
            "currency": "SEK",
            "is_online": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Workshop – Nationell mars 2026",
            "title_en": "Workshop – National March 2026",
            "title_ar": "ورشة عمل – وطنية مارس 2026",
            "description": "Nationell workshop. Ingen åldersgräns.",
            "description_en": "National workshop. No age limit.",
            "description_ar": "ورشة عمل وطنية. لا يوجد حد للعمر.",
            "workshop_type": "national",
            "target_gender": "all",
            "date": "2026-03-13",
            "location": "Stockholm, Sverige",
            "location_en": "Stockholm, Sweden",
            "location_ar": "ستوكهولم، السويد",
            "spots": 30,
            "spots_left": 30,
            "age_min": None,
            "age_max": None,
            "price": 500,
            "currency": "SEK",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "ToT – Training of Trainers (FDS)",
            "title_en": "ToT – Training of Trainers (FDS)",
            "title_ar": "تدريب المدربين (FDS)",
            "description": "FDS-utbildning (Training of Trainers). För dig som vill bli certifierad Haggai-tränare och leda workshops.",
            "description_en": "FDS training (Training of Trainers). For those who want to become certified Haggai trainers and lead workshops.",
            "description_ar": "تدريب FDS (تدريب المدربين). لمن يريد أن يصبح مدرب حجاي معتمد ويقود ورش العمل.",
            "workshop_type": "tot",
            "target_gender": "all",
            "date": None,
            "location": "På plats eller online",
            "location_en": "On-site or online",
            "location_ar": "في الموقع أو عبر الإنترنت",
            "spots": None,
            "spots_left": None,
            "age_min": None,
            "age_max": None,
            "price": None,
            "currency": "SEK",
            "is_tot": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.workshops.insert_many(initial_workshops)
    return {"message": f"Seeded {len(initial_workshops)} workshops", "count": len(initial_workshops)}


# ==================== WORKSHOP AGENDA ENDPOINTS ====================

@api_router.get("/workshops/{workshop_id}/agenda")
async def get_workshop_agenda(workshop_id: str):
    """Get the agenda for a specific workshop"""
    agenda = await db.workshop_agendas.find_one({"workshop_id": workshop_id}, {"_id": 0})
    if not agenda:
        # Return empty agenda structure if none exists
        return {"workshop_id": workshop_id, "days": [], "is_published": False}
    return agenda


@api_router.post("/workshops/{workshop_id}/agenda")
async def create_or_update_workshop_agenda(workshop_id: str, input: WorkshopAgendaCreate):
    """Create or update agenda for a workshop"""
    # Get workshop info
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    # Process days and sessions with leader names
    processed_days = []
    for day_data in input.days:
        sessions = []
        for session_data in day_data.sessions:
            session_dict = session_data.model_dump()
            session_dict["id"] = str(uuid.uuid4())
            
            # Get leader name if leader_id is provided
            if session_data.leader_id:
                leader = await db.leaders.find_one({"id": session_data.leader_id}, {"_id": 0, "name": 1})
                session_dict["leader_name"] = leader["name"] if leader else None
            
            sessions.append(session_dict)
        
        day_dict = {
            "id": str(uuid.uuid4()),
            "date": day_data.date,
            "day_number": day_data.day_number,
            "title": day_data.title,
            "sessions": sessions
        }
        processed_days.append(day_dict)
    
    # Check if agenda already exists
    existing = await db.workshop_agendas.find_one({"workshop_id": workshop_id})
    
    agenda_data = {
        "workshop_id": workshop_id,
        "workshop_title": workshop.get("title"),
        "days": processed_days,
        "is_published": input.is_published,
        "notify_participants": input.notify_participants,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if existing:
        await db.workshop_agendas.update_one(
            {"workshop_id": workshop_id},
            {"$set": agenda_data}
        )
        agenda_data["id"] = existing["id"]
        agenda_data["created_at"] = existing.get("created_at")
    else:
        agenda_data["id"] = str(uuid.uuid4())
        agenda_data["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.workshop_agendas.insert_one(agenda_data)
    
    # If publishing, notify participants
    if input.is_published and input.notify_participants:
        asyncio.create_task(notify_participants_agenda_published(workshop_id, workshop))
    
    return agenda_data


@api_router.put("/workshops/{workshop_id}/agenda/publish")
async def publish_workshop_agenda(workshop_id: str, notify: bool = True):
    """Publish a workshop agenda and optionally notify participants"""
    agenda = await db.workshop_agendas.find_one({"workshop_id": workshop_id})
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    
    await db.workshop_agendas.update_one(
        {"workshop_id": workshop_id},
        {"$set": {"is_published": True, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if notify:
        workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
        if workshop:
            asyncio.create_task(notify_participants_agenda_published(workshop_id, workshop))
    
    return {"success": True, "message": "Agenda published"}


@api_router.get("/agenda/public/{workshop_id}")
async def get_public_agenda(workshop_id: str):
    """Get published agenda (public view for participants)"""
    agenda = await db.workshop_agendas.find_one(
        {"workshop_id": workshop_id, "is_published": True}, 
        {"_id": 0}
    )
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found or not published")
    
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    return {
        **agenda,
        "workshop": workshop
    }


@api_router.get("/leaders/{leader_id}/sessions")
async def get_leader_sessions(leader_id: str):
    """Get all sessions assigned to a specific leader"""
    # Find all agendas containing this leader
    agendas = await db.workshop_agendas.find({}, {"_id": 0}).to_list(100)
    
    leader_sessions = []
    for agenda in agendas:
        workshop_title = agenda.get("workshop_title", "")
        for day in agenda.get("days", []):
            for session in day.get("sessions", []):
                if session.get("leader_id") == leader_id:
                    leader_sessions.append({
                        "workshop_id": agenda["workshop_id"],
                        "workshop_title": workshop_title,
                        "day_date": day["date"],
                        "day_number": day["day_number"],
                        "session": session
                    })
    
    return leader_sessions


async def notify_participants_agenda_published(workshop_id: str, workshop: dict):
    """Send email to all accepted participants when agenda is published"""
    # Get all accepted participants for this workshop
    participants = await db.nominations.find({
        "event_id": workshop_id,
        "status": {"$in": ["approved", "registered", "completed"]}
    }, {"_id": 0}).to_list(1000)
    
    if not participants:
        logging.info(f"No participants to notify for workshop {workshop_id}")
        return
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    agenda_link = f"{frontend_url}/program/{workshop_id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📋 Programmet är klart!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej!</p>
            
            <p>Programmet för <strong>{workshop.get('title', 'utbildningen')}</strong> är nu publicerat!</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #014D73; margin: 20px 0;">
                <p style="margin: 0;"><strong>📅 Datum:</strong> {workshop.get('date', 'Se programmet')}</p>
                <p style="margin: 5px 0 0 0;"><strong>📍 Plats:</strong> {workshop.get('location', 'Se programmet')}</p>
            </div>
            
            <p>Se hela dagsprogrammet med tider, ämnen och ledare genom att klicka på knappen nedan:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{agenda_link}" style="display: inline-block; background: #014D73; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Se programmet →
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Du kommer också få påminnelser innan varje utbildningsdag.</p>
            
            <p style="margin-top: 30px;">Vi ses snart!<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    for participant in participants:
        email = participant.get("nominee_email") or participant.get("registration_data", {}).get("email")
        if email:
            try:
                await asyncio.to_thread(resend.Emails.send, {
                    "from": SENDER_EMAIL,
                    "to": [email],
                    "subject": f"📋 Programmet för {workshop.get('title', 'utbildningen')} är klart!",
                    "html": html_content
                })
                logging.info(f"Agenda notification sent to {email}")
            except Exception as e:
                logging.error(f"Failed to send agenda notification to {email}: {str(e)}")


async def send_daily_reminder(workshop_id: str, day_data: dict, workshop: dict):
    """Send reminder for a specific day to all participants"""
    participants = await db.nominations.find({
        "event_id": workshop_id,
        "status": {"$in": ["approved", "registered", "completed"]}
    }, {"_id": 0}).to_list(1000)
    
    if not participants:
        return
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    agenda_link = f"{frontend_url}/program/{workshop_id}"
    
    # Build session list HTML
    sessions_html = ""
    for session in day_data.get("sessions", []):
        if session.get("session_type") == "break":
            sessions_html += f'<tr style="background: #f5f5f5;"><td style="padding: 8px;">☕ {session.get("start_time")}</td><td style="padding: 8px;" colspan="2">{session.get("title", "Paus")}</td></tr>'
        else:
            sessions_html += f'<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">{session.get("start_time")}-{session.get("end_time")}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{session.get("title")}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{session.get("leader_name", "-")}</td></tr>'
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Påminnelse: Dag {day_data.get('day_number')}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <h2 style="color: #014D73; margin-top: 0;">{workshop.get('title', 'Utbildning')}</h2>
            <p><strong>📅 {day_data.get('date')}</strong> - {day_data.get('title', f"Dag {day_data.get('day_number')}")}</p>
            
            <h3 style="color: #014D73;">Dagens program:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <tr style="background: #014D73; color: white;">
                    <th style="padding: 10px; text-align: left;">Tid</th>
                    <th style="padding: 10px; text-align: left;">Session</th>
                    <th style="padding: 10px; text-align: left;">Ledare</th>
                </tr>
                {sessions_html}
            </table>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{agenda_link}" style="display: inline-block; background: #014D73; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    Se hela programmet →
                </a>
            </div>
            
            <p style="margin-top: 30px;">Vi ses!<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    for participant in participants:
        email = participant.get("nominee_email") or participant.get("registration_data", {}).get("email")
        if email:
            try:
                await asyncio.to_thread(resend.Emails.send, {
                    "from": SENDER_EMAIL,
                    "to": [email],
                    "subject": f"⏰ Påminnelse: {workshop.get('title', 'Utbildning')} - Dag {day_data.get('day_number')}",
                    "html": html_content
                })
            except Exception as e:
                logging.error(f"Failed to send reminder to {email}: {str(e)}")


@api_router.post("/workshops/{workshop_id}/agenda/send-reminder")
async def send_agenda_reminder(workshop_id: str, day_number: int):
    """Manually send reminder for a specific day"""
    agenda = await db.workshop_agendas.find_one({"workshop_id": workshop_id}, {"_id": 0})
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    day_data = next((d for d in agenda.get("days", []) if d.get("day_number") == day_number), None)
    if not day_data:
        raise HTTPException(status_code=404, detail=f"Day {day_number} not found in agenda")
    
    asyncio.create_task(send_daily_reminder(workshop_id, day_data, workshop))
    
    return {"success": True, "message": f"Reminder sent for day {day_number}"}


@api_router.get("/member/agenda/{workshop_id}")
async def get_member_agenda(workshop_id: str, token: str):
    """Get agenda for a member (checks if they are a participant)"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member_id = payload.get("member_id")
        
        # Check if member is a participant in this workshop
        member = await db.members.find_one({"id": member_id}, {"_id": 0})
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        
        # Get agenda
        agenda = await db.workshop_agendas.find_one(
            {"workshop_id": workshop_id, "is_published": True}, 
            {"_id": 0}
        )
        if not agenda:
            raise HTTPException(status_code=404, detail="Agenda not found or not published")
        
        workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
        
        return {
            **agenda,
            "workshop": workshop
        }
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== SESSION EVALUATION ENDPOINTS ====================

@api_router.post("/workshops/{workshop_id}/sessions/{session_id}/send-evaluation")
async def send_evaluation_to_participants(workshop_id: str, session_id: str):
    """Send evaluation link to all registered participants for a session"""
    # Get workshop info
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    # Get agenda and session info
    agenda = await db.workshop_agendas.find_one({"workshop_id": workshop_id}, {"_id": 0})
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    
    session_data = None
    for day in agenda.get("days", []):
        for session in day.get("sessions", []):
            if session.get("id") == session_id:
                session_data = session
                break
    
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get all registered/approved participants
    participants = await db.nominations.find({
        "event_id": workshop_id,
        "status": {"$in": ["approved", "registered", "completed"]}
    }, {"_id": 0}).to_list(1000)
    
    # Also get members who might be participants
    members = await db.members.find({}, {"_id": 0, "email": 1, "name": 1}).to_list(1000)
    
    if not participants and not members:
        return {"success": False, "message": "No participants found", "sent_count": 0}
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    eval_link = f"{frontend_url}/utvardering/{workshop_id}/{session_id}"
    
    # Get workshop title
    workshop_title = workshop.get("title")
    if isinstance(workshop_title, dict):
        workshop_title = workshop_title.get("sv", workshop_title.get("en", ""))
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📝 Utvärdera sessionen</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej!</p>
            
            <p>Vi vill gärna höra vad du tyckte om sessionen:</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #014D73; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; font-size: 18px;">{session_data.get('title', 'Session')}</p>
                <p style="margin: 5px 0 0 0; color: #666;">Ledare: {session_data.get('leader_name', 'N/A')}</p>
                <p style="margin: 5px 0 0 0; color: #666;">{workshop_title}</p>
            </div>
            
            <p>Din feedback hjälper oss att förbättra våra utbildningar. Utvärderingen tar bara 1-2 minuter.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{eval_link}" style="display: inline-block; background: #014D73; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Utvärdera nu →
                </a>
            </div>
            
            <p style="color: #999; font-size: 12px;">Utvärderingen är anonym för ledaren.</p>
            
            <p style="margin-top: 30px;">Tack för din medverkan!<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    sent_count = 0
    emails_sent = set()
    
    # Send to participants
    for participant in participants:
        email = participant.get("nominee_email") or participant.get("registration_data", {}).get("email")
        if email and email not in emails_sent:
            try:
                await asyncio.to_thread(resend.Emails.send, {
                    "from": SENDER_EMAIL,
                    "to": [email],
                    "subject": f"📝 Utvärdera: {session_data.get('title', 'Session')} - {workshop_title}",
                    "html": html_content
                })
                emails_sent.add(email)
                sent_count += 1
            except Exception as e:
                logging.error(f"Failed to send evaluation email to {email}: {str(e)}")
    
    # Send to members
    for member in members:
        email = member.get("email")
        if email and email not in emails_sent:
            try:
                await asyncio.to_thread(resend.Emails.send, {
                    "from": SENDER_EMAIL,
                    "to": [email],
                    "subject": f"📝 Utvärdera: {session_data.get('title', 'Session')} - {workshop_title}",
                    "html": html_content
                })
                emails_sent.add(email)
                sent_count += 1
            except Exception as e:
                logging.error(f"Failed to send evaluation email to {email}: {str(e)}")
    
    return {"success": True, "message": f"Evaluation sent to {sent_count} participants", "sent_count": sent_count}


@api_router.get("/member/pending-evaluations")
async def get_member_pending_evaluations(token: str):
    """Get pending evaluations for a member"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member_id = payload.get("member_id")
        
        member = await db.members.find_one({"id": member_id}, {"_id": 0})
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        
        member_email = member.get("email")
        
        # Get all published agendas
        agendas = await db.workshop_agendas.find({"is_published": True}, {"_id": 0}).to_list(100)
        
        # Get evaluations already submitted by this member
        submitted_evals = await db.session_evaluations.find(
            {"participant_email": member_email},
            {"_id": 0, "session_id": 1}
        ).to_list(1000)
        submitted_session_ids = {e["session_id"] for e in submitted_evals}
        
        pending = []
        for agenda in agendas:
            workshop = await db.workshops.find_one({"id": agenda["workshop_id"]}, {"_id": 0})
            workshop_title = workshop.get("title") if workshop else ""
            if isinstance(workshop_title, dict):
                workshop_title = workshop_title.get("sv", workshop_title.get("en", ""))
            
            for day in agenda.get("days", []):
                for session in day.get("sessions", []):
                    # Only include sessions with leaders that haven't been evaluated
                    if (session.get("session_type") == "session" and 
                        session.get("leader_id") and 
                        session.get("id") not in submitted_session_ids):
                        pending.append({
                            "workshop_id": agenda["workshop_id"],
                            "workshop_title": workshop_title,
                            "session_id": session.get("id"),
                            "session_title": session.get("title"),
                            "leader_name": session.get("leader_name"),
                            "day_date": day.get("date"),
                            "start_time": session.get("start_time")
                        })
        
        return pending
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/evaluation-questions")
async def get_evaluation_questions(active_only: bool = True):
    """Get all evaluation questions"""
    query = {"is_active": True} if active_only else {}
    questions = await db.evaluation_questions.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return questions


@api_router.post("/evaluation-questions")
async def create_evaluation_question(input: EvaluationQuestionCreate):
    """Create a new evaluation question"""
    question = EvaluationQuestion(
        **input.model_dump()
    )
    await db.evaluation_questions.insert_one(question.model_dump())
    return question.model_dump()


@api_router.put("/evaluation-questions/{question_id}")
async def update_evaluation_question(question_id: str, input: EvaluationQuestionUpdate):
    """Update an evaluation question"""
    existing = await db.evaluation_questions.find_one({"id": question_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.evaluation_questions.update_one({"id": question_id}, {"$set": update_data})
    updated = await db.evaluation_questions.find_one({"id": question_id}, {"_id": 0})
    return updated


@api_router.delete("/evaluation-questions/{question_id}")
async def delete_evaluation_question(question_id: str):
    """Delete an evaluation question (soft delete - set inactive)"""
    result = await db.evaluation_questions.update_one(
        {"id": question_id},
        {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"success": True}


@api_router.post("/evaluations")
async def submit_evaluation(input: SessionEvaluationCreate):
    """Submit a session evaluation (by participant)"""
    # Get session and leader info for caching
    agenda = await db.workshop_agendas.find_one({"workshop_id": input.workshop_id}, {"_id": 0})
    session_title = None
    if agenda:
        for day in agenda.get("days", []):
            for session in day.get("sessions", []):
                if session.get("id") == input.session_id:
                    session_title = session.get("title")
                    break
    
    # Get leader name
    leader = await db.leaders.find_one({"id": input.leader_id}, {"_id": 0, "name": 1})
    leader_name = leader.get("name") if leader else None
    
    evaluation = SessionEvaluation(
        workshop_id=input.workshop_id,
        session_id=input.session_id,
        leader_id=input.leader_id,
        leader_name=leader_name,
        session_title=session_title,
        participant_email=input.participant_email,
        answers=input.answers,
        comment=input.comment
    )
    
    await db.session_evaluations.insert_one(evaluation.model_dump())
    return {"success": True, "id": evaluation.id}


@api_router.get("/evaluations/session/{session_id}")
async def get_session_evaluations(session_id: str, include_participant_info: bool = False):
    """Get all evaluations for a specific session (admin only)"""
    projection = {"_id": 0}
    if not include_participant_info:
        projection["participant_id"] = 0
        projection["participant_email"] = 0
    
    evaluations = await db.session_evaluations.find(
        {"session_id": session_id}, 
        projection
    ).to_list(1000)
    
    return evaluations


@api_router.get("/evaluations/leader/{leader_id}")
async def get_leader_evaluations(leader_id: str, workshop_id: Optional[str] = None):
    """Get all evaluations for a specific leader"""
    query = {"leader_id": leader_id}
    if workshop_id:
        query["workshop_id"] = workshop_id
    
    evaluations = await db.session_evaluations.find(
        query,
        {"_id": 0, "participant_id": 0, "participant_email": 0}
    ).to_list(1000)
    
    return evaluations


@api_router.get("/evaluations/stats")
async def get_evaluation_statistics(
    workshop_id: Optional[str] = None,
    leader_id: Optional[str] = None,
    session_id: Optional[str] = None
):
    """Get evaluation statistics with averages and comparisons"""
    query = {}
    if workshop_id:
        query["workshop_id"] = workshop_id
    if leader_id:
        query["leader_id"] = leader_id
    if session_id:
        query["session_id"] = session_id
    
    evaluations = await db.session_evaluations.find(query, {"_id": 0}).to_list(10000)
    
    if not evaluations:
        return {
            "total_evaluations": 0,
            "overall_average": 0,
            "questions_stats": [],
            "leaders_comparison": [],
            "sessions_stats": []
        }
    
    # Get all questions for reference
    questions = await db.evaluation_questions.find({}, {"_id": 0}).to_list(100)
    questions_map = {q["id"]: q for q in questions}
    
    # Calculate statistics
    total_evaluations = len(evaluations)
    all_ratings = []
    questions_ratings = {}  # question_id -> list of ratings
    leaders_ratings = {}    # leader_id -> {name, ratings: []}
    sessions_ratings = {}   # session_id -> {title, leader, ratings: []}
    
    for eval in evaluations:
        leader_id = eval.get("leader_id")
        session_id = eval.get("session_id")
        
        # Initialize leader stats
        if leader_id not in leaders_ratings:
            leaders_ratings[leader_id] = {
                "leader_id": leader_id,
                "leader_name": eval.get("leader_name", "Okänd"),
                "ratings": [],
                "evaluation_count": 0
            }
        leaders_ratings[leader_id]["evaluation_count"] += 1
        
        # Initialize session stats
        if session_id not in sessions_ratings:
            sessions_ratings[session_id] = {
                "session_id": session_id,
                "session_title": eval.get("session_title", "Okänd session"),
                "leader_name": eval.get("leader_name"),
                "ratings": [],
                "evaluation_count": 0
            }
        sessions_ratings[session_id]["evaluation_count"] += 1
        
        for answer in eval.get("answers", []):
            rating = answer.get("rating", 0)
            q_id = answer.get("question_id")
            
            all_ratings.append(rating)
            
            # Per question
            if q_id not in questions_ratings:
                questions_ratings[q_id] = []
            questions_ratings[q_id].append(rating)
            
            # Per leader
            leaders_ratings[leader_id]["ratings"].append(rating)
            
            # Per session
            sessions_ratings[session_id]["ratings"].append(rating)
    
    # Calculate averages
    overall_average = sum(all_ratings) / len(all_ratings) if all_ratings else 0
    
    questions_stats = []
    for q_id, ratings in questions_ratings.items():
        q_info = questions_map.get(q_id, {})
        avg = sum(ratings) / len(ratings) if ratings else 0
        questions_stats.append({
            "question_id": q_id,
            "question_text": q_info.get("text_sv", "Okänd fråga"),
            "average_rating": round(avg, 2),
            "response_count": len(ratings),
            "min_rating": min(ratings) if ratings else 0,
            "max_rating": max(ratings) if ratings else 0
        })
    
    leaders_comparison = []
    for leader_data in leaders_ratings.values():
        ratings = leader_data["ratings"]
        avg = sum(ratings) / len(ratings) if ratings else 0
        leaders_comparison.append({
            "leader_id": leader_data["leader_id"],
            "leader_name": leader_data["leader_name"],
            "average_rating": round(avg, 2),
            "evaluation_count": leader_data["evaluation_count"],
            "total_ratings": len(ratings)
        })
    leaders_comparison.sort(key=lambda x: x["average_rating"], reverse=True)
    
    sessions_stats = []
    for session_data in sessions_ratings.values():
        ratings = session_data["ratings"]
        avg = sum(ratings) / len(ratings) if ratings else 0
        sessions_stats.append({
            "session_id": session_data["session_id"],
            "session_title": session_data["session_title"],
            "leader_name": session_data["leader_name"],
            "average_rating": round(avg, 2),
            "evaluation_count": session_data["evaluation_count"]
        })
    sessions_stats.sort(key=lambda x: x["average_rating"], reverse=True)
    
    return {
        "total_evaluations": total_evaluations,
        "overall_average": round(overall_average, 2),
        "questions_stats": questions_stats,
        "leaders_comparison": leaders_comparison,
        "sessions_stats": sessions_stats
    }


@api_router.get("/evaluations/leader/{leader_id}/detailed")
async def get_leader_detailed_stats(leader_id: str):
    """Get detailed statistics for a specific leader including per-question breakdown"""
    evaluations = await db.session_evaluations.find(
        {"leader_id": leader_id},
        {"_id": 0, "participant_id": 0, "participant_email": 0}
    ).to_list(1000)
    
    if not evaluations:
        return {
            "leader_id": leader_id,
            "total_evaluations": 0,
            "sessions": [],
            "questions_breakdown": [],
            "strengths": [],
            "improvement_areas": []
        }
    
    # Get questions
    questions = await db.evaluation_questions.find({"is_active": True}, {"_id": 0}).to_list(100)
    questions_map = {q["id"]: q for q in questions}
    
    # Get leader info
    leader = await db.leaders.find_one({"id": leader_id}, {"_id": 0})
    
    # Organize by session
    sessions_data = {}
    questions_ratings = {}
    
    for eval in evaluations:
        s_id = eval.get("session_id")
        if s_id not in sessions_data:
            sessions_data[s_id] = {
                "session_id": s_id,
                "session_title": eval.get("session_title"),
                "evaluations": [],
                "ratings": []
            }
        sessions_data[s_id]["evaluations"].append(eval)
        
        for answer in eval.get("answers", []):
            q_id = answer.get("question_id")
            rating = answer.get("rating", 0)
            
            sessions_data[s_id]["ratings"].append(rating)
            
            if q_id not in questions_ratings:
                questions_ratings[q_id] = []
            questions_ratings[q_id].append(rating)
    
    # Calculate per-session averages
    sessions_summary = []
    for s_data in sessions_data.values():
        ratings = s_data["ratings"]
        avg = sum(ratings) / len(ratings) if ratings else 0
        sessions_summary.append({
            "session_id": s_data["session_id"],
            "session_title": s_data["session_title"],
            "evaluation_count": len(s_data["evaluations"]),
            "average_rating": round(avg, 2)
        })
    
    # Calculate per-question breakdown
    questions_breakdown = []
    for q_id, ratings in questions_ratings.items():
        q_info = questions_map.get(q_id, {})
        avg = sum(ratings) / len(ratings) if ratings else 0
        questions_breakdown.append({
            "question_id": q_id,
            "question_text": q_info.get("text_sv", "Okänd fråga"),
            "average_rating": round(avg, 2),
            "response_count": len(ratings)
        })
    
    # Sort to identify strengths and improvement areas
    questions_breakdown.sort(key=lambda x: x["average_rating"], reverse=True)
    
    strengths = [q for q in questions_breakdown if q["average_rating"] >= 8][:3]
    improvement_areas = [q for q in questions_breakdown if q["average_rating"] < 7][:3]
    
    return {
        "leader_id": leader_id,
        "leader_name": leader.get("name") if leader else "Okänd",
        "leader_email": leader.get("email") if leader else None,
        "total_evaluations": len(evaluations),
        "overall_average": round(sum(sum(s["ratings"]) for s in sessions_data.values()) / 
                                  sum(len(s["ratings"]) for s in sessions_data.values()), 2) if sessions_data else 0,
        "sessions": sessions_summary,
        "questions_breakdown": questions_breakdown,
        "strengths": strengths,
        "improvement_areas": improvement_areas
    }


@api_router.post("/evaluations/feedback")
async def send_leader_feedback(input: LeaderFeedbackCreate):
    """Send feedback to a leader (admin action)"""
    # Get leader info
    leader = await db.leaders.find_one({"id": input.leader_id}, {"_id": 0})
    if not leader:
        raise HTTPException(status_code=404, detail="Leader not found")
    
    leader_email = leader.get("email")
    if not leader_email:
        raise HTTPException(status_code=400, detail="Leader has no email address")
    
    # Get statistics if requested
    stats_summary = None
    if input.include_statistics:
        stats = await get_leader_detailed_stats(input.leader_id)
        stats_summary = {
            "total_evaluations": stats.get("total_evaluations"),
            "overall_average": stats.get("overall_average"),
            "strengths": stats.get("strengths", []),
            "improvement_areas": stats.get("improvement_areas", [])
        }
    
    # Build email content
    feedback_type_text = {
        "praise": "Beröm",
        "improvement": "Utvecklingsområden",
        "general": "Återkoppling"
    }.get(input.feedback_type, "Återkoppling")
    
    stats_html = ""
    if stats_summary:
        strengths_html = "".join([f"<li>✓ {s['question_text']}: {s['average_rating']}/10</li>" for s in stats_summary.get("strengths", [])])
        improvements_html = "".join([f"<li>→ {s['question_text']}: {s['average_rating']}/10</li>" for s in stats_summary.get("improvement_areas", [])])
        
        stats_html = f"""
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #014D73; margin-top: 0;">📊 Sammanfattning av utvärderingar</h3>
            <p><strong>Antal utvärderingar:</strong> {stats_summary.get('total_evaluations', 0)}</p>
            <p><strong>Genomsnittligt betyg:</strong> {stats_summary.get('overall_average', 0)}/10</p>
            
            {f'<h4 style="color: #22c55e;">🌟 Styrkor</h4><ul>{strengths_html}</ul>' if strengths_html else ''}
            {f'<h4 style="color: #f59e0b;">📈 Utvecklingsområden</h4><ul>{improvements_html}</ul>' if improvements_html else ''}
        </div>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💬 {feedback_type_text} från Haggai Sweden</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej {leader.get('name', '')}!</p>
            
            <h2 style="color: #014D73;">{input.subject}</h2>
            
            <div style="white-space: pre-line;">{input.message}</div>
            
            {stats_html}
            
            <p style="margin-top: 30px; color: #666;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [leader_email],
            "subject": f"{feedback_type_text}: {input.subject}",
            "html": html_content
        })
        
        # Save feedback record
        feedback = LeaderFeedback(
            leader_id=input.leader_id,
            leader_email=leader_email,
            workshop_id=input.workshop_id,
            session_id=input.session_id,
            feedback_type=input.feedback_type,
            subject=input.subject,
            message=input.message,
            statistics_summary=stats_summary
        )
        await db.leader_feedback.insert_one(feedback.model_dump())
        
        return {"success": True, "message": f"Feedback sent to {leader_email}"}
    except Exception as e:
        logging.error(f"Failed to send feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send feedback: {str(e)}")


@api_router.get("/evaluations/feedback/{leader_id}")
async def get_leader_feedback_history(leader_id: str):
    """Get history of feedback sent to a leader"""
    feedback = await db.leader_feedback.find(
        {"leader_id": leader_id},
        {"_id": 0}
    ).sort("sent_at", -1).to_list(100)
    return feedback


@api_router.get("/evaluation/form/{workshop_id}/{session_id}")
async def get_evaluation_form_data(workshop_id: str, session_id: str):
    """Get data needed to render evaluation form (public endpoint)"""
    # Get workshop info
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    # Get agenda and session
    agenda = await db.workshop_agendas.find_one({"workshop_id": workshop_id}, {"_id": 0})
    session_data = None
    if agenda:
        for day in agenda.get("days", []):
            for session in day.get("sessions", []):
                if session.get("id") == session_id:
                    session_data = session
                    break
    
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get leader info
    leader = None
    if session_data.get("leader_id"):
        leader = await db.leaders.find_one({"id": session_data["leader_id"]}, {"_id": 0, "id": 1, "name": 1})
    
    # Get active questions
    questions = await db.evaluation_questions.find(
        {"is_active": True},
        {"_id": 0}
    ).sort("order", 1).to_list(100)
    
    # Get workshop title (handle multilingual)
    workshop_title = workshop.get("title")
    if isinstance(workshop_title, dict):
        workshop_title = workshop_title.get("sv", workshop_title.get("en", ""))
    
    return {
        "workshop_id": workshop_id,
        "workshop_title": workshop_title,
        "session_id": session_id,
        "session_title": session_data.get("title"),
        "leader_id": session_data.get("leader_id"),
        "leader_name": leader.get("name") if leader else session_data.get("leader_name"),
        "questions": questions
    }


# ==================== TRAINING PARTICIPANTS ENDPOINTS ====================

class TrainingParticipantStatusUpdate(BaseModel):
    status: str  # pending, accepted, rejected, completed


class TrainingParticipantAttendanceUpdate(BaseModel):
    attendance_hours: float


@api_router.get("/training-participants")
async def get_training_participants():
    """Get all nominations that have completed registration (training participants)"""
    # Find all nominations where registration has been completed
    participants = await db.nominations.find(
        {"registration_completed": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return participants


@api_router.get("/training-participants/{participant_id}")
async def get_training_participant(participant_id: str):
    """Get a specific training participant by nomination ID"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    return participant


@api_router.put("/training-participants/{participant_id}/status")
async def update_training_participant_status(participant_id: str, input: TrainingParticipantStatusUpdate):
    """Update a training participant's status (accept/reject)"""
    existing = await db.nominations.find_one({"id": participant_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    update_data = {
        "status": input.status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": participant_id}, {"$set": update_data})
    
    updated = await db.nominations.find_one({"id": participant_id}, {"_id": 0})
    return updated


@api_router.put("/training-participants/{participant_id}/attendance")
async def update_training_participant_attendance(participant_id: str, input: TrainingParticipantAttendanceUpdate):
    """Update a training participant's attendance hours"""
    existing = await db.nominations.find_one({"id": participant_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    # If attendance reaches 21 hours, mark as completed
    new_status = existing.get("status", "pending")
    if input.attendance_hours >= 21:
        new_status = "completed"
    
    update_data = {
        "attendance_hours": input.attendance_hours,
        "status": new_status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": participant_id}, {"$set": update_data})
    
    updated = await db.nominations.find_one({"id": participant_id}, {"_id": 0})
    return updated


def generate_diploma_pdf(participant_name: str, event_title: str, event_date: str = None, chairman_name: str = "Bashar Yousif") -> BytesIO:
    """Generate a PDF diploma certificate with Haggai logo"""
    buffer = BytesIO()
    
    # Create PDF with landscape A4
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        leftMargin=1.5*cm,
        rightMargin=1.5*cm,
        topMargin=1*cm,
        bottomMargin=1*cm
    )
    
    # Define colors - Haggai blue from logo
    haggai_blue = colors.HexColor('#014D73')
    gold = colors.HexColor('#c9a227')
    
    # Create styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=26,
        textColor=haggai_blue,
        alignment=TA_CENTER,
        spaceAfter=10,
        fontName='Helvetica-Bold',
        letterSpacing=6
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=haggai_blue,
        alignment=TA_CENTER,
        spaceAfter=20,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Heading1'],
        fontSize=36,
        textColor=haggai_blue,
        alignment=TA_CENTER,
        spaceBefore=20,
        spaceAfter=20,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.black,
        alignment=TA_CENTER,
        spaceBefore=15,
        spaceAfter=15,
        leading=20
    )
    
    signature_style = ParagraphStyle(
        'Signature',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.black,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    role_style = ParagraphStyle(
        'Role',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    # Build content
    story = []
    
    # Add Haggai logo at top
    logo_path = ROOT_DIR / 'haggai_logo.png'
    if logo_path.exists():
        logo = Image(str(logo_path), width=4*cm, height=2.8*cm)
        logo.hAlign = 'CENTER'
        story.append(logo)
        story.append(Spacer(1, 0.5*cm))
    
    # Main title
    story.append(Paragraph("A D V A N C E D   L E A D E R S H I P   S E M I N A R", title_style))
    
    # Event subtitle
    event_subtitle = event_title
    if event_date:
        event_subtitle += f" – {event_date}"
    story.append(Paragraph(event_subtitle, subtitle_style))
    
    story.append(Spacer(1, 0.5*cm))
    
    # Decorative line
    line_table = Table([['']], colWidths=[400])
    line_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 2, gold),
    ]))
    story.append(line_table)
    
    # Participant name
    story.append(Paragraph(participant_name, name_style))
    
    # Decorative line
    story.append(line_table)
    
    story.append(Spacer(1, 0.5*cm))
    
    # Body text
    body_text = """Having successfully completed the specialized studies in Advanced Leadership 
    as prescribed by Haggai International, is hereby awarded this Certificate of Completion."""
    story.append(Paragraph(body_text, body_style))
    
    story.append(Spacer(1, 1*cm))
    
    # Date
    completion_date = event_date if event_date else datetime.now().strftime("%B %Y")
    story.append(Paragraph(f"<b>D A T E:</b>  {completion_date}", signature_style))
    
    story.append(Spacer(1, 1.5*cm))
    
    # Signatures table
    signature_data = [
        [
            Paragraph("Dr. Bev Upton Williams", signature_style),
            "",
            Paragraph(chairman_name, signature_style)
        ],
        [
            Paragraph("CEO, Haggai International", role_style),
            "",
            Paragraph("President of the Association", role_style)
        ]
    ]
    
    sig_table = Table(signature_data, colWidths=[200, 150, 200])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LINEABOVE', (0, 0), (0, 0), 1, colors.black),
        ('LINEABOVE', (2, 0), (2, 0), 1, colors.black),
    ]))
    story.append(sig_table)
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer


@api_router.post("/training-participants/{participant_id}/generate-diploma")
async def generate_training_participant_diploma(participant_id: str):
    """Generate a PDF diploma for a training participant"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    # Check if participant has completed 21 hours
    attendance_hours = participant.get("attendance_hours", 0)
    if attendance_hours < 21:
        raise HTTPException(status_code=400, detail=f"Participant has only {attendance_hours} hours. 21 hours required for diploma.")
    
    # Get participant name from registration data
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    event_date = participant.get("event_date", "")
    
    # Generate PDF
    pdf_buffer = generate_diploma_pdf(
        participant_name=participant_name,
        event_title=event_title,
        event_date=event_date
    )
    
    # Return PDF as download
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Diploma_{participant_name.replace(" ", "_")}.pdf"'
        }
    )


@api_router.post("/training-participants/{participant_id}/preview-diploma")
async def preview_training_participant_diploma(participant_id: str):
    """Generate a PDF diploma and return as base64 for preview"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    # Check if participant has completed 21 hours
    attendance_hours = participant.get("attendance_hours", 0)
    if attendance_hours < 21:
        raise HTTPException(status_code=400, detail=f"Participant has only {attendance_hours} hours. 21 hours required for diploma.")
    
    # Get participant name from registration data
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    event_date = participant.get("event_date", "")
    
    # Generate PDF
    pdf_buffer = generate_diploma_pdf(
        participant_name=participant_name,
        event_title=event_title,
        event_date=event_date
    )
    
    # Return as base64
    pdf_content = pdf_buffer.read()
    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    
    return {
        "pdf_base64": pdf_base64,
        "filename": f"Diploma_{participant_name.replace(' ', '_')}.pdf"
    }


@api_router.get("/training-participants/{participant_id}/view-diploma")
async def view_training_participant_diploma(participant_id: str):
    """View diploma PDF in browser (inline)"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    attendance_hours = participant.get("attendance_hours", 0)
    if attendance_hours < 21:
        raise HTTPException(status_code=400, detail=f"Participant has only {attendance_hours} hours. 21 hours required for diploma.")
    
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    event_date = participant.get("event_date", "")
    
    pdf_buffer = generate_diploma_pdf(
        participant_name=participant_name,
        event_title=event_title,
        event_date=event_date
    )
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="Diploma_{participant_name.replace(" ", "_")}.pdf"'
        }
    )


@api_router.get("/training-participants/{participant_id}/download-diploma")
async def download_training_participant_diploma(participant_id: str):
    """Download diploma PDF as attachment"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    attendance_hours = participant.get("attendance_hours", 0)
    if attendance_hours < 21:
        raise HTTPException(status_code=400, detail=f"Participant has only {attendance_hours} hours. 21 hours required for diploma.")
    
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    event_date = participant.get("event_date", "")
    
    pdf_buffer = generate_diploma_pdf(
        participant_name=participant_name,
        event_title=event_title,
        event_date=event_date
    )
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Diploma_{participant_name.replace(" ", "_")}.pdf"'
        }
    )


async def send_diploma_email(participant: dict, pdf_buffer: BytesIO):
    """Send diploma PDF via email to participant"""
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    participant_email = registration_data.get("email", participant.get("nominee_email"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    
    if not participant_email:
        raise HTTPException(status_code=400, detail="Participant email not found")
    
    # Read PDF content and encode as base64
    pdf_content = pdf_buffer.read()
    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #15564e 0%, #0f403a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎓 Grattis!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Du har klarat utbildningen!</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej <strong>{participant_name}</strong>,</p>
            
            <p>Grattis till att ha slutfört <strong>{event_title}</strong>!</p>
            
            <p>Vi är stolta över ditt engagemang och din dedikation. Bifogat till detta e-postmeddelande hittar du ditt diplom som bekräftar att du har genomfört alla 21 timmars utbildning.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #15564e; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32;">
                    <strong>📄 Ditt diplom är bifogat som PDF-fil</strong>
                </p>
            </div>
            
            <p>Vi hoppas att denna utbildning har gett dig värdefulla kunskaper och verktyg för ditt ledarskap.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                <p style="color: #999; font-size: 12px;">
                    <a href="https://peoplepotential.se" style="color: #15564e;">peoplepotential.se</a> | 
                    <a href="mailto:info@haggai.se" style="color: #15564e;">info@haggai.se</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [participant_email],
        "subject": f"🎓 Ditt diplom från {event_title}",
        "html": html_content,
        "attachments": [
            {
                "filename": f"Diploma_{participant_name.replace(' ', '_')}.pdf",
                "content": pdf_base64
            }
        ]
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Diploma email sent to {participant_email}, id: {email.get('id')}")
        return True
    except Exception as e:
        logging.error(f"Failed to send diploma email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@api_router.post("/training-participants/{participant_id}/send-diploma")
async def send_training_participant_diploma(participant_id: str):
    """Generate and send diploma via email to a training participant"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "registration_completed": True},
        {"_id": 0}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Training participant not found")
    
    # Check if participant has completed 21 hours
    attendance_hours = participant.get("attendance_hours", 0)
    if attendance_hours < 21:
        raise HTTPException(status_code=400, detail=f"Participant has only {attendance_hours} hours. 21 hours required for diploma.")
    
    # Get participant details
    registration_data = participant.get("registration_data", {})
    participant_name = registration_data.get("full_name", participant.get("nominee_name", "Unknown"))
    event_title = participant.get("event_title", "Haggai Leadership Seminar")
    event_date = participant.get("event_date", "")
    
    # Generate PDF
    pdf_buffer = generate_diploma_pdf(
        participant_name=participant_name,
        event_title=event_title,
        event_date=event_date
    )
    
    # Send email
    await send_diploma_email(participant, pdf_buffer)
    
    # Create member account automatically
    member = await create_member_from_participant(participant)
    
    # Update participant record to mark diploma as sent
    await db.nominations.update_one(
        {"id": participant_id},
        {"$set": {
            "diploma_sent": True,
            "diploma_sent_at": datetime.now(timezone.utc).isoformat(),
            "member_created": member is not None,
            "member_id": member['id'] if member else None,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"success": True, "message": "Diploma sent successfully", "member_created": member is not None}


# ==================== NAME BADGE GENERATION ====================

def generate_name_badge_pdf(
    name: str,
    organization: str,
    workshop_title: str,
    badge_type: str = "participant"  # "participant" or "leader"
) -> BytesIO:
    """Generate a PDF name badge for participants or leaders - A6 format (105 x 148 mm)"""
    buffer = BytesIO()
    
    # A6 size: 105mm x 148mm (standard postcard size)
    badge_width = 10.5 * cm
    badge_height = 14.8 * cm
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=(badge_width, badge_height),
        leftMargin=0.5*cm,
        rightMargin=0.5*cm,
        topMargin=0.5*cm,
        bottomMargin=0.5*cm
    )
    
    # Define colors based on badge type
    if badge_type == "leader":
        label_bg_color = colors.HexColor('#A78BFA')  # Lighter purple
        badge_label = "LEADER"
    else:  # participant
        label_bg_color = colors.HexColor('#22D3EE')  # Lighter teal
        badge_label = "PARTICIPANT"
    
    # Create styles
    styles = getSampleStyleSheet()
    
    logo_style = ParagraphStyle(
        'Logo',
        parent=styles['Heading1'],
        fontSize=32,
        textColor=colors.white,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        letterSpacing=4
    )
    
    label_style = ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.white,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    name_style = ParagraphStyle(
        'NameBadge',
        parent=styles['Heading1'],
        fontSize=32,  # Increased from 24 to 32
        textColor=colors.black,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=36
    )
    
    org_style = ParagraphStyle(
        'Organization',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.grey,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    workshop_label_style = ParagraphStyle(
        'WorkshopLabel',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=TA_CENTER,
        fontName='Helvetica',
        letterSpacing=2
    )
    
    workshop_style = ParagraphStyle(
        'Workshop',
        parent=styles['Normal'],
        fontSize=16,
        textColor=colors.black,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Build content
    story = []
    
    # Add Haggai logo image if available
    logo_path = Path(__file__).parent / "haggai-logo-white.png"
    if logo_path.exists():
        logo_img = Image(str(logo_path), width=3*cm, height=1.2*cm)
        story.append(logo_img)
        story.append(Spacer(1, 0.2*cm))
    else:
        # Fallback to text logo
        story.append(Paragraph("HAGGAI", logo_style))
        story.append(Spacer(1, 0.3*cm))
    
    # Badge label
    label_table = Table([[Paragraph(badge_label, label_style)]], colWidths=[badge_width - 1*cm])
    label_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), label_bg_color),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(label_table)
    story.append(Spacer(1, 30))
    
    # Name
    story.append(Paragraph(name, name_style))
    story.append(Spacer(1, 8))
    
    # Organization
    if organization:
        story.append(Paragraph(organization, org_style))
    story.append(Spacer(1, 40))
    
    # Workshop section
    story.append(Paragraph("WORKSHOP", workshop_label_style))
    story.append(Spacer(1, 5))
    story.append(Paragraph(workshop_title, workshop_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@api_router.post("/participants/forgot-password")
async def participant_forgot_password(request: ForgotPasswordRequest):
    """Send password reset email to participant"""
    participant = await db.participants.find_one(
        {"email": request.email.lower()},
        {"_id": 0}
    )
    
    if not participant:
        # Don't reveal if email exists or not for security
        return {"success": True, "message": "If email exists, reset link sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Store reset token
    await db.password_resets.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": participant['id'],
        "user_type": "participant",
        "token": reset_token,
        "email": participant['email'],
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Send email
    await send_password_reset_email(
        participant['email'],
        participant['full_name'],
        reset_token,
        "participant"
    )
    
    return {"success": True, "message": "Reset link sent"}


@api_router.get("/participants/validate-reset-token/{token}")
async def validate_reset_token(token: str):
    """Validate if reset token is valid and not expired"""
    reset_record = await db.password_resets.find_one(
        {"token": token, "user_type": "participant", "used": False},
        {"_id": 0}
    )
    
    if not reset_record:
        raise HTTPException(status_code=404, detail="Invalid token")
    
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Token expired")
    
    return {"valid": True}


@api_router.post("/participants/reset-password")
async def participant_reset_password(request: ResetPasswordRequest):
    """Reset participant password using token"""
    reset_record = await db.password_resets.find_one(
        {"token": request.token, "user_type": "participant", "used": False},
        {"_id": 0}
    )
    
    if not reset_record:
        raise HTTPException(status_code=404, detail="Invalid token")
    
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Token expired")
    
    # Hash new password
    password_hash = bcrypt.hashpw(request.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Update participant password
    await db.participants.update_one(
        {"id": reset_record['user_id']},
        {"$set": {"password_hash": password_hash, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Mark token as used
    await db.password_resets.update_one(
        {"token": request.token},
        {"$set": {"used": True, "used_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"success": True, "message": "Password reset successfully"}


async def send_password_reset_email(email: str, name: str, token: str, user_type: str):
    """Send password reset email"""
    frontend_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    
    if user_type == "participant":
        reset_link = f"{frontend_url}/deltagare/aterstall-losenord/{token}"
        portal_name = "Deltagare Portal"
    elif user_type == "member":
        reset_link = f"{frontend_url}/medlem/aterstall-losenord/{token}"
        portal_name = "Medlemsportalen"
    else:
        reset_link = f"{frontend_url}/ledare/aterstall-losenord/{token}"
        portal_name = "Ledarportalen"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0891B2 0%, #0e7490 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔒 Återställ lösenord</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">{portal_name}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{name}</strong>,</p>
            
            <p>Du har begärt att återställa ditt lösenord för {portal_name}.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="display: inline-block; background: #0891B2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Återställ lösenord →
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Länken är giltig i 1 timme.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">Om du inte begärde denna återställning, ignorera detta mejl.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "🔒 Återställ ditt lösenord - Haggai Sweden",
            "html": html_content
        })
        logging.info(f"Password reset email sent to {email}")
    except Exception as e:
        logging.error(f"Failed to send password reset email: {str(e)}")



# ==================== PARTICIPANT PORTAL ENDPOINTS ====================

class ParticipantLogin(BaseModel):
    email: str
    password: str


@api_router.post("/participants/login")
async def participant_login(credentials: ParticipantLogin):
    """Participant login endpoint"""
    participant = await db.participants.find_one(
        {"email": credentials.email.lower()},
        {"_id": 0}
    )
    
    if not participant:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), participant['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT token
    token_data = {
        "sub": participant['id'],
        "email": participant['email'],
        "type": "participant",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    # Update last login
    await db.participants.update_one(
        {"id": participant['id']},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Remove password hash from response
    participant_data = {k: v for k, v in participant.items() if k != 'password_hash'}
    
    return {
        "token": token,
        "participant": participant_data
    }


@api_router.get("/participants/me")
async def get_participant_me(authorization: str = Header(None)):
    """Get current participant's data"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(' ')[1]
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        participant_id = payload.get('sub')
        
        participant = await db.participants.find_one(
            {"id": participant_id},
            {"_id": 0, "password_hash": 0}
        )
        
        if not participant:
            raise HTTPException(status_code=404, detail="Participant not found")
        
        return participant
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/members/forgot-password")
async def member_forgot_password(request: ForgotPasswordRequest):
    """Send password reset email to member"""
    member = await db.members.find_one(
        {"email": request.email.lower()},
        {"_id": 0}
    )
    
    if not member:
        return {"success": True, "message": "If email exists, reset link sent"}
    
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.password_resets.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": member['id'],
        "user_type": "member",
        "token": reset_token,
        "email": member['email'],
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    await send_password_reset_email(
        member['email'],
        member['full_name'],
        reset_token,
        "member"
    )
    
    return {"success": True, "message": "Reset link sent"}


@api_router.get("/members/validate-reset-token/{token}")
async def validate_member_reset_token(token: str):
    """Validate if reset token is valid"""
    reset_record = await db.password_resets.find_one(
        {"token": token, "user_type": "member", "used": False},
        {"_id": 0}
    )
    
    if not reset_record:
        raise HTTPException(status_code=404, detail="Invalid token")
    
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Token expired")
    
    return {"valid": True}


@api_router.post("/members/reset-password")
async def member_reset_password(request: ResetPasswordRequest):
    """Reset member password using token"""
    reset_record = await db.password_resets.find_one(
        {"token": request.token, "user_type": "member", "used": False},
        {"_id": 0}
    )
    
    if not reset_record:
        raise HTTPException(status_code=404, detail="Invalid token")
    
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace("Z", "+00:00"))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Token expired")
    
    password_hash = bcrypt.hashpw(request.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    await db.members.update_one(
        {"id": reset_record['user_id']},
        {"$set": {"password_hash": password_hash, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await db.password_resets.update_one(
        {"token": request.token},
        {"$set": {"used": True, "used_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"success": True, "message": "Password reset successfully"}


# ==================== MEMBER SYSTEM ====================


@api_router.get("/participants/{participant_id}/name-badge")
async def get_participant_name_badge(participant_id: str):
    """Generate and download name badge for an approved participant"""
    participant = await db.nominations.find_one(
        {"id": participant_id, "status": "approved"},
        {"_id": 0}
    )
    
    if not participant:
        raise HTTPException(status_code=404, detail="Approved participant not found")
    
    # Get participant info
    registration_data = participant.get("registration_data") or {}
    participant_name = registration_data.get("full_name") or participant.get("nominee_name", "Unknown")
    organization = registration_data.get("church_name") or participant.get("nominee_church", "")
    workshop_title = participant.get("event_title", "Haggai Workshop")
    
    # Generate PDF
    pdf_buffer = generate_name_badge_pdf(
        name=participant_name,
        organization=organization,
        workshop_title=workshop_title,
        badge_type="participant"
    )
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Name_Badge_{participant_name.replace(" ", "_")}.pdf"'
        }
    )


@api_router.get("/leaders/{leader_id}/name-badge")
async def get_leader_name_badge(leader_id: str):
    """Generate and download name badge for an approved leader"""
    leader = await db.leader_registrations.find_one(
        {"id": leader_id, "status": "approved"},
        {"_id": 0}
    )
    
    if not leader:
        raise HTTPException(status_code=404, detail="Approved leader not found")
    
    # Get leader info
    leader_name = leader.get("name", "Unknown")
    # For leader, we'll use their organization or leave blank
    organization = leader.get("employer_name", leader.get("church_name", ""))
    
    # Try to get workshop info from invitation if available
    invitation_id = leader.get("invitation_id")
    workshop_title = "Haggai Workshop"
    if invitation_id:
        invitation = await db.leader_invitations.find_one(
            {"id": invitation_id},
            {"_id": 0}
        )
        if invitation and invitation.get("workshop_title"):
            workshop_title = invitation.get("workshop_title")
    
    # Generate PDF
    pdf_buffer = generate_name_badge_pdf(
        name=leader_name,
        organization=organization,
        workshop_title=workshop_title,
        badge_type="leader"
    )
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Name_Badge_{leader_name.replace(" ", "_")}.pdf"'
        }
    )


# ==================== MEMBER SYSTEM ====================

def generate_password(length=12):
    """Generate a random password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(length))


class MemberLogin(BaseModel):
    email: str
    password: str


class MemberProfileUpdate(BaseModel):
    phone: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    profile_image: Optional[str] = None


class DirectMessage(BaseModel):
    recipient_id: str
    content: str


class ForumPost(BaseModel):
    title: str
    content: str


class ForumReply(BaseModel):
    content: str


class CategoryCreate(BaseModel):
    name: str
    type: str  # 'expertise' or 'interest'


async def create_member_from_participant(participant: dict):
    """Create a new member account when diploma is sent"""
    registration_data = participant.get("registration_data", {})
    email = registration_data.get("email", participant.get("nominee_email"))
    
    if not email:
        return None
    
    # Check if member already exists
    existing = await db.members.find_one({"email": email})
    if existing:
        return existing
    
    # Generate password
    password = generate_password()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    member = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": password_hash,
        "full_name": registration_data.get("full_name", participant.get("nominee_name", "")),
        "phone": registration_data.get("phone", ""),
        "city": registration_data.get("address", ""),
        "bio": "",
        "expertise": [],
        "interests": [],
        "profile_image": None,
        "nomination_id": participant.get("id"),
        "diplomas": [{
            "event_title": participant.get("event_title", "Haggai Leadership Seminar"),
            "event_date": participant.get("event_date", ""),
            "completed_at": datetime.now(timezone.utc).isoformat()
        }],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None,
        "is_active": True
    }
    
    await db.members.insert_one(member)
    
    # Send welcome email with password
    await send_member_welcome_email(email, registration_data.get("full_name", ""), password)
    
    return member


async def send_member_welcome_email(email: str, name: str, password: str):
    """Send welcome email to new member with login credentials"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Välkommen till Haggai Sweden!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Du är nu medlem i vår gemenskap</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hej <strong>{name}</strong>,</p>
            
            <p>Grattis till ditt diplom och välkommen som medlem i Haggai Sweden!</p>
            
            <p>Som medlem kan du nu:</p>
            <ul>
                <li>🔐 Logga in på medlemsområdet</li>
                <li>👥 Se och kontakta andra medlemmar</li>
                <li>💬 Skicka direktmeddelanden</li>
                <li>📝 Delta i diskussionsforumet</li>
                <li>✏️ Skapa din profil med expertis och intressen</li>
            </ul>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #014D73; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Dina inloggningsuppgifter:</p>
                <p style="margin: 5px 0;"><strong>E-post:</strong> {email}</p>
                <p style="margin: 5px 0;"><strong>Lösenord:</strong> {password}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">Vi rekommenderar att du ändrar ditt lösenord efter första inloggningen.</p>
            
            <p style="margin-top: 30px;">Med vänliga hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [email],
        "subject": "🎉 Välkommen till Haggai Sweden - Dina inloggningsuppgifter",
        "html": html_content
    }
    
    try:
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Member welcome email sent to {email}, id: {email_response.get('id')}")
    except Exception as e:
        logging.error(f"Failed to send member welcome email: {str(e)}")


# Member Authentication
@api_router.post("/members/login")
async def member_login(input: MemberLogin):
    """Login for members"""
    member = await db.members.find_one({"email": input.email.lower()})
    if not member:
        raise HTTPException(status_code=401, detail="Felaktig e-post eller lösenord")
    
    if not bcrypt.checkpw(input.password.encode('utf-8'), member['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Felaktig e-post eller lösenord")
    
    if not member.get('is_active', True):
        raise HTTPException(status_code=401, detail="Ditt konto är inaktiverat")
    
    # Update last login
    await db.members.update_one(
        {"id": member['id']},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Generate JWT token
    token_data = {
        "member_id": member['id'],
        "email": member['email'],
        "type": "member",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "token": token,
        "member": {
            "id": member['id'],
            "email": member['email'],
            "full_name": member['full_name'],
            "profile_image": member.get('profile_image')
        }
    }


@api_router.get("/members/me")
async def get_current_member(token: str = None):
    """Get current logged in member"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('type') != 'member':
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        member = await db.members.find_one({"id": payload['member_id']}, {"_id": 0, "password_hash": 0})
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        
        # Get unread message count
        unread_count = await db.direct_messages.count_documents({
            "recipient_id": member['id'],
            "read": False
        })
        member['unread_messages'] = unread_count
        
        return member
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.put("/members/me")
async def update_member_profile(input: MemberProfileUpdate, token: str = None):
    """Update current member's profile"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member_id = payload['member_id']
        
        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        if input.phone is not None:
            update_data["phone"] = input.phone
        if input.city is not None:
            update_data["city"] = input.city
        if input.bio is not None:
            update_data["bio"] = input.bio
        if input.expertise is not None:
            update_data["expertise"] = input.expertise
        if input.interests is not None:
            update_data["interests"] = input.interests
        if input.profile_image is not None:
            update_data["profile_image"] = input.profile_image
        
        await db.members.update_one({"id": member_id}, {"$set": update_data})
        
        member = await db.members.find_one({"id": member_id}, {"_id": 0, "password_hash": 0})
        return member
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.put("/members/me/password")
async def change_member_password(old_password: str, new_password: str, token: str = None):
    """Change member password"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member = await db.members.find_one({"id": payload['member_id']})
        
        if not bcrypt.checkpw(old_password.encode('utf-8'), member['password_hash'].encode('utf-8')):
            raise HTTPException(status_code=400, detail="Felaktigt nuvarande lösenord")
        
        new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        await db.members.update_one(
            {"id": payload['member_id']},
            {"$set": {"password_hash": new_hash, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        return {"success": True, "message": "Lösenord ändrat"}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Member Directory
@api_router.get("/members")
async def get_all_members(token: str = None):
    """Get all members (requires authentication)"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        members = await db.members.find(
            {"is_active": True},
            {"_id": 0, "password_hash": 0}
        ).sort("full_name", 1).to_list(1000)
        
        return members
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/members/{member_id}")
async def get_member_profile(member_id: str, token: str = None):
    """Get a specific member's profile"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        member = await db.members.find_one(
            {"id": member_id, "is_active": True},
            {"_id": 0, "password_hash": 0}
        )
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        
        return member
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Direct Messages
@api_router.post("/messages")
async def send_direct_message(input: DirectMessage, token: str = None):
    """Send a direct message to another member"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        sender_id = payload['member_id']
        
        # Verify recipient exists
        recipient = await db.members.find_one({"id": input.recipient_id})
        if not recipient:
            raise HTTPException(status_code=404, detail="Recipient not found")
        
        sender = await db.members.find_one({"id": sender_id})
        
        message = {
            "id": str(uuid.uuid4()),
            "sender_id": sender_id,
            "recipient_id": input.recipient_id,
            "content": input.content,
            "read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.direct_messages.insert_one(message)
        
        # Send email notification
        await send_message_notification_email(
            recipient['email'],
            recipient['full_name'],
            sender['full_name'],
            input.content[:100] + "..." if len(input.content) > 100 else input.content
        )
        
        return {"success": True, "message_id": message['id']}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def send_message_notification_email(recipient_email: str, recipient_name: str, sender_name: str, preview: str):
    """Send email notification for new message"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #014D73; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">💬 Nytt meddelande</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p>Hej <strong>{recipient_name}</strong>,</p>
            <p><strong>{sender_name}</strong> har skickat dig ett meddelande:</p>
            <div style="background: white; padding: 15px; border-left: 4px solid #014D73; margin: 15px 0;">
                <p style="margin: 0; color: #666;">{preview}</p>
            </div>
            <p>Logga in på medlemsområdet för att läsa och svara.</p>
            <p style="margin-top: 20px;">Hälsningar,<br><strong>Haggai Sweden</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"💬 Nytt meddelande från {sender_name}",
            "html": html_content
        })
    except Exception as e:
        logging.error(f"Failed to send message notification: {str(e)}")


@api_router.get("/messages")
async def get_messages(token: str = None):
    """Get all messages for current member (inbox)"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member_id = payload['member_id']
        
        # Get conversations (unique sender/recipient pairs)
        messages = await db.direct_messages.find({
            "$or": [
                {"sender_id": member_id},
                {"recipient_id": member_id}
            ]
        }, {"_id": 0}).sort("created_at", -1).to_list(1000)
        
        # Group by conversation partner
        conversations = {}
        for msg in messages:
            partner_id = msg['recipient_id'] if msg['sender_id'] == member_id else msg['sender_id']
            if partner_id not in conversations:
                partner = await db.members.find_one({"id": partner_id}, {"_id": 0, "password_hash": 0})
                conversations[partner_id] = {
                    "partner": partner,
                    "messages": [],
                    "unread_count": 0,
                    "last_message": msg
                }
            conversations[partner_id]['messages'].append(msg)
            if msg['recipient_id'] == member_id and not msg['read']:
                conversations[partner_id]['unread_count'] += 1
        
        return list(conversations.values())
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/messages/{partner_id}")
async def get_conversation(partner_id: str, token: str = None):
    """Get all messages with a specific member"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        member_id = payload['member_id']
        
        messages = await db.direct_messages.find({
            "$or": [
                {"sender_id": member_id, "recipient_id": partner_id},
                {"sender_id": partner_id, "recipient_id": member_id}
            ]
        }, {"_id": 0}).sort("created_at", 1).to_list(1000)
        
        # Mark as read
        await db.direct_messages.update_many(
            {"sender_id": partner_id, "recipient_id": member_id, "read": False},
            {"$set": {"read": True}}
        )
        
        partner = await db.members.find_one({"id": partner_id}, {"_id": 0, "password_hash": 0})
        
        return {"messages": messages, "partner": partner}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Forum
@api_router.post("/forum")
async def create_forum_post(input: ForumPost, token: str = None):
    """Create a new forum post"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        author = await db.members.find_one({"id": payload['member_id']}, {"_id": 0, "password_hash": 0})
        
        post = {
            "id": str(uuid.uuid4()),
            "title": input.title,
            "content": input.content,
            "author_id": payload['member_id'],
            "author_name": author['full_name'],
            "author_image": author.get('profile_image'),
            "replies": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.forum_posts.insert_one(post)
        return {"success": True, "post_id": post['id']}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/forum")
async def get_forum_posts(token: str = None):
    """Get all forum posts"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        posts = await db.forum_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return posts
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/forum/{post_id}")
async def get_forum_post(post_id: str, token: str = None):
    """Get a specific forum post with replies"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        post = await db.forum_posts.find_one({"id": post_id}, {"_id": 0})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return post
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/forum/{post_id}/reply")
async def reply_to_forum_post(post_id: str, input: ForumReply, token: str = None):
    """Reply to a forum post"""
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        author = await db.members.find_one({"id": payload['member_id']}, {"_id": 0, "password_hash": 0})
        
        reply = {
            "id": str(uuid.uuid4()),
            "content": input.content,
            "author_id": payload['member_id'],
            "author_name": author['full_name'],
            "author_image": author.get('profile_image'),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.forum_posts.update_one(
            {"id": post_id},
            {
                "$push": {"replies": reply},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        return {"success": True, "reply_id": reply['id']}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Admin: Categories Management
@api_router.get("/categories")
async def get_categories():
    """Get all expertise and interest categories"""
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories


@api_router.post("/categories")
async def create_category(input: CategoryCreate):
    """Create a new category (admin only)"""
    category = {
        "id": str(uuid.uuid4()),
        "name": input.name,
        "type": input.type,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.categories.insert_one(category)
    return category


@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    """Delete a category (admin only)"""
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"success": True}


# Seed default categories
@api_router.post("/categories/seed")
async def seed_categories():
    """Seed default expertise and interest categories"""
    default_categories = [
        {"id": str(uuid.uuid4()), "name": "Ledarskap", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Mentorskap", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Affärsutveckling", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Kyrkoarbete", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Utbildning", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Mission", "type": "expertise", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Nätverk", "type": "interest", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Ledarutveckling", "type": "interest", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Företagande", "type": "interest", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Samhällsengagemang", "type": "interest", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Internationellt arbete", "type": "interest", "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    
    # Only add if not exists
    existing = await db.categories.count_documents({})
    if existing == 0:
        await db.categories.insert_many(default_categories)
        return {"message": f"Seeded {len(default_categories)} categories"}
    
    return {"message": "Categories already exist"}


# ==================== WORKSHOP TOPICS FOR LEADERS ====================

# Predefined workshop topics that leaders can choose from (based on Haggai curriculum)
WORKSHOP_TOPICS = [
    {
        "id": "stewardship",
        "name_sv": "Förvaltarskap",
        "name_en": "Stewardship",
        "name_ar": "الوكالة",
        "description_sv": "Hur man förvaltar resurser, tid och talanger ansvarsfullt",
        "description_en": "How to manage resources, time and talents responsibly",
        "description_ar": "كيفية إدارة الموارد والوقت والمواهب بمسؤولية",
        "hours": 4
    },
    {
        "id": "context",
        "name_sv": "Sammanhang",
        "name_en": "Context",
        "name_ar": "السياق",
        "description_sv": "Förstå kulturella och samhälleliga sammanhang inom ledarskap",
        "description_en": "Understanding cultural and societal contexts in leadership",
        "description_ar": "فهم السياقات الثقافية والاجتماعية في القيادة",
        "hours": 5
    },
    {
        "id": "next_generation",
        "name_sv": "Nästa Generation",
        "name_en": "Next Generation",
        "name_ar": "الجيل القادم",
        "description_sv": "Strategier för att utveckla och utrusta framtida ledare",
        "description_en": "Strategies for developing and equipping future leaders",
        "description_ar": "استراتيجيات لتطوير وتجهيز قادة المستقبل",
        "hours": 5
    },
    {
        "id": "leadership",
        "name_sv": "Ledarskap",
        "name_en": "Leadership",
        "name_ar": "القيادة",
        "description_sv": "Praktiska verktyg och principer för effektivt ledarskap",
        "description_en": "Practical tools and principles for effective leadership",
        "description_ar": "أدوات ومبادئ عملية للقيادة الفعالة",
        "hours": 4
    },
    {
        "id": "goal_setting",
        "name_sv": "Målsättning",
        "name_en": "Goal Setting",
        "name_ar": "تحديد الأهداف",
        "description_sv": "Hur man sätter och uppnår meningsfulla mål",
        "description_en": "How to set and achieve meaningful goals",
        "description_ar": "كيفية وضع وتحقيق أهداف ذات معنى",
        "hours": 5
    }
]


@api_router.get("/workshop-topics")
async def get_workshop_topics():
    """Get available workshop topics for leader selection"""
    return WORKSHOP_TOPICS


# ==================== LEADER INVITATION & REGISTRATION ENDPOINTS ====================

# --- Leader Invitations ---

@api_router.get("/leader-invitations")
async def get_leader_invitations(status: Optional[str] = None):
    """Get all leader invitations"""
    query = {}
    if status:
        query["status"] = status
    invitations = await db.leader_invitations.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return invitations


@api_router.get("/leader-invitations/{token}")
async def get_leader_invitation_by_token(token: str):
    """Get a leader invitation by token (public endpoint for registration form)"""
    invitation = await db.leader_invitations.find_one({"token": token}, {"_id": 0})
    if not invitation:
        raise HTTPException(status_code=404, detail="Inbjudan hittades inte")
    
    # Check if expired
    if invitation.get("expires_at"):
        expires_at = datetime.fromisoformat(invitation["expires_at"].replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(status_code=410, detail="Inbjudan har gått ut")
    
    # Check if already registered
    if invitation.get("status") == "registered":
        raise HTTPException(status_code=400, detail="Denna inbjudan har redan använts")
    
    return invitation


@api_router.post("/leader-invitations")
async def create_leader_invitation(input: LeaderInvitationCreate):
    """Create and send a leader invitation"""
    # Check if leader is already registered
    existing_leader = await db.leader_registrations.find_one({"email": input.email.lower()})
    if existing_leader:
        raise HTTPException(status_code=400, detail="Denna ledare är redan registrerad")
    
    # Allow multiple pending invitations - just mark old ones as superseded
    await db.leader_invitations.update_many(
        {"email": input.email.lower(), "status": "pending"},
        {"$set": {"status": "superseded", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    invitation = LeaderInvitation(**input.model_dump())
    invitation.email = invitation.email.lower()
    
    doc = invitation.model_dump()
    await db.leader_invitations.insert_one(doc)
    
    # Send invitation email
    base_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    registration_link = f"{base_url}/ledare/registrera/{invitation.token}"
    lang = input.language or "sv"
    
    # Multilingual email content
    email_texts = {
        "sv": {
            "subject": "🎉 Du är inbjuden som ledare - Haggai Sweden Workshop",
            "header": "Du är inbjuden som ledare!",
            "greeting": f"Hej <strong>{input.name}</strong>,",
            "intro": "Vi är glada att meddela att du har blivit inbjuden att delta som <strong>ledare/facilitator</strong> i en kommande Haggai Sweden workshop! 🙌",
            "workshop_label": "Workshop",
            "form_intro": "För att vi ska kunna planera i god ordning ber vi dig vänligen fylla i registreringsformuläret. Där kan du bland annat:",
            "items": [
                "📝 Ange dina kontaktuppgifter och bakgrund",
                "📚 <strong>Välja vilket ämne du ska hålla</strong> bland våra fem kärnämnen",
                "🔄 Ange vilka <strong>backup-ämnen</strong> du kan ta om behov uppstår",
                "✈️ Meddela om du behöver stöd med resa och logi",
                "🏦 Lämna bankuppgifter för eventuell ersättning",
                "📄 Ladda upp material om ditt ämne"
            ],
            "button": "✨ Fyll i formuläret nu",
            "validity": "Länken är giltig i 30 dagar.",
            "closing": "Vi ser fram emot ditt deltagande och bidrag till vår workshop! Tveka inte att kontakta oss på",
            "signature": "Med varma hälsningar,"
        },
        "en": {
            "subject": "🎉 You are invited as a leader - Haggai Sweden Workshop",
            "header": "You are invited as a leader!",
            "greeting": f"Hello <strong>{input.name}</strong>,",
            "intro": "We are pleased to inform you that you have been invited to participate as a <strong>leader/facilitator</strong> in an upcoming Haggai Sweden workshop! 🙌",
            "workshop_label": "Workshop",
            "form_intro": "To help us plan effectively, please fill out the registration form. You can:",
            "items": [
                "📝 Enter your contact details and background",
                "📚 <strong>Choose which topic to present</strong> from our five core subjects",
                "🔄 Indicate which <strong>backup topics</strong> you can cover if needed",
                "✈️ Let us know if you need support with travel and accommodation",
                "🏦 Provide bank details for potential reimbursement",
                "📄 Upload materials about your topic"
            ],
            "button": "✨ Fill out the form now",
            "validity": "The link is valid for 30 days.",
            "closing": "We look forward to your participation and contribution to our workshop! Please don't hesitate to contact us at",
            "signature": "Warm regards,"
        },
        "ar": {
            "subject": "🎉 أنت مدعو كقائد - ورشة عمل هاجاي السويد",
            "header": "أنت مدعو كقائد!",
            "greeting": f"مرحباً <strong>{input.name}</strong>،",
            "intro": "يسعدنا أن نبلغك أنك قد تمت دعوتك للمشاركة كـ<strong>قائد/ميسر</strong> في ورشة عمل هاجاي السويد القادمة! 🙌",
            "workshop_label": "ورشة العمل",
            "form_intro": "لمساعدتنا في التخطيط بشكل فعال، يرجى ملء استمارة التسجيل. يمكنك:",
            "items": [
                "📝 إدخال بيانات الاتصال والخلفية الخاصة بك",
                "📚 <strong>اختيار الموضوع الذي ستقدمه</strong> من بين موضوعاتنا الخمسة الأساسية",
                "🔄 تحديد <strong>المواضيع الاحتياطية</strong> التي يمكنك تغطيتها عند الحاجة",
                "✈️ إعلامنا إذا كنت بحاجة إلى دعم للسفر والإقامة",
                "🏦 تقديم التفاصيل البنكية لتعويض المصاريف المحتملة",
                "📄 رفع المواد المتعلقة بموضوعك"
            ],
            "button": "✨ املأ الاستمارة الآن",
            "validity": "الرابط صالح لمدة 30 يوماً.",
            "closing": "نتطلع إلى مشاركتك ومساهمتك في ورشة العمل! لا تتردد في التواصل معنا على",
            "signature": "مع أطيب التحيات،"
        }
    }
    
    txt = email_texts.get(lang, email_texts["sv"])
    is_rtl = lang == "ar"
    dir_attr = 'dir="rtl"' if is_rtl else ''
    text_align = "right" if is_rtl else "left"
    
    workshop_info = ""
    if input.workshop_title:
        workshop_info = f"""
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; border-{'right' if is_rtl else 'left'}: 4px solid #014D73; margin: 20px 0;">
            <p style="margin: 0;"><strong>🎯 {txt['workshop_label']}:</strong> {input.workshop_title}</p>
        </div>
        """
    
    items_html = "".join([f"<li>{item}</li>" for item in txt['items']])
    
    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" {dir_attr}>
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Haggai Sweden</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">{txt['header']}</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff; text-align: {text_align};">
            <p style="font-size: 16px;">{txt['greeting']}</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
                {txt['intro']}
            </p>
            
            {workshop_info}
            
            <p style="font-size: 16px; line-height: 1.6;">
                {txt['form_intro']}
            </p>
            
            <ul style="font-size: 15px; line-height: 1.8; color: #444; text-align: {text_align};">
                {items_html}
            </ul>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="{registration_link}" 
                   style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(1, 77, 115, 0.3);">
                    {txt['button']}
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
                {txt['validity']}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 15px; line-height: 1.6;">
                {txt['closing']} <a href="mailto:info@haggai.se" style="color: #014D73;">info@haggai.se</a>
            </p>
            
            <p style="margin-top: 25px; font-size: 15px;">
                {txt['signature']}<br>
                <strong>Haggai Sweden</strong>
            </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
                Haggai Sweden | <a href="https://haggai.se" style="color: #014D73;">haggai.se</a> (By Keeada)
            </p>
        </div>
    </div>
    """
    
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [input.email],
            "subject": txt['subject'],
            "html": email_html
        })
        
        # Update sent_at
        await db.leader_invitations.update_one(
            {"id": invitation.id},
            {"$set": {"sent_at": datetime.now(timezone.utc).isoformat()}}
        )
    except Exception as e:
        logger.error(f"Failed to send invitation email: {e}")
    
    return {"message": "Inbjudan skickad", "invitation_id": invitation.id}


@api_router.delete("/leader-invitations/{invitation_id}")
async def delete_leader_invitation(invitation_id: str):
    """Delete a leader invitation"""
    result = await db.leader_invitations.delete_one({"id": invitation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inbjudan hittades inte")
    return {"message": "Inbjudan raderad"}


@api_router.post("/leader-invitations/{invitation_id}/resend")
async def resend_leader_invitation(invitation_id: str):
    """Resend a leader invitation email"""
    invitation = await db.leader_invitations.find_one({"id": invitation_id})
    if not invitation:
        raise HTTPException(status_code=404, detail="Inbjudan hittades inte")
    
    if invitation.get("status") == "registered":
        raise HTTPException(status_code=400, detail="Denna inbjudan har redan använts")
    
    base_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
    registration_link = f"{base_url}/ledare/registrera/{invitation['token']}"
    
    workshop_info = ""
    if invitation.get("workshop_title"):
        workshop_info = f"<p><strong>Workshop:</strong> {invitation['workshop_title']}</p>"
    
    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Haggai Sweden</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Påminnelse: Ledarregistrering</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
            <p>Hej <strong>{invitation['name']}</strong>,</p>
            
            <p>Detta är en påminnelse om din inbjudan att registrera dig som ledare hos Haggai Sweden.</p>
            
            {workshop_info}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{registration_link}" 
                   style="background: #014D73; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    Registrera dig nu
                </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px;">
                Haggai Sweden | <a href="https://haggai.se" style="color: #014D73;">haggai.se</a> (By Keeada)
            </p>
        </div>
    </div>
    """
    
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [invitation['email']],
            "subject": "Påminnelse: Ledarregistrering - Haggai Sweden",
            "html": email_html
        })
        
        await db.leader_invitations.update_one(
            {"id": invitation_id},
            {"$set": {"sent_at": datetime.now(timezone.utc).isoformat()}}
        )
    except Exception as e:
        logger.error(f"Failed to resend invitation email: {e}")
        raise HTTPException(status_code=500, detail="Kunde inte skicka e-post")
    
    return {"message": "Påminnelse skickad"}


# --- Leader Registration ---

@api_router.post("/leaders/register/{token}")
async def register_leader(token: str, input: LeaderRegistrationCreate):
    """Register a new leader using invitation token"""
    # Verify invitation
    invitation = await db.leader_invitations.find_one({"token": token})
    if not invitation:
        raise HTTPException(status_code=404, detail="Ogiltig inbjudningslänk")
    
    if invitation.get("status") == "registered":
        raise HTTPException(status_code=400, detail="Denna inbjudan har redan använts")
    
    # Check expiry
    if invitation.get("expires_at"):
        expires_at = datetime.fromisoformat(invitation["expires_at"].replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(status_code=410, detail="Inbjudan har gått ut")
    
    # Check if email already registered
    existing = await db.leader_registrations.find_one({"email": input.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Denna e-post är redan registrerad")
    
    # Hash password
    password_hash = bcrypt.hashpw(input.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create leader registration
    leader_data = input.model_dump()
    del leader_data['password']
    # Update email to lowercase before creating the object
    leader_data['email'] = input.email.lower()
    
    # Store profile image in image_url field if provided
    if input.profile_image:
        leader_data['image_url'] = input.profile_image
    
    leader = LeaderRegistration(
        **leader_data,
        invitation_id=invitation['id'],
        password_hash=password_hash
    )
    
    doc = leader.model_dump()
    await db.leader_registrations.insert_one(doc)
    
    # Update invitation status
    await db.leader_invitations.update_one(
        {"token": token},
        {"$set": {"status": "registered"}}
    )
    
    # Notify admin
    try:
        admin_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #014D73;">Ny ledarregistrering</h2>
            <p>En ny ledare har registrerat sig och väntar på godkännande:</p>
            <ul>
                <li><strong>Namn:</strong> {leader.name}</li>
                <li><strong>E-post:</strong> {leader.email}</li>
                <li><strong>Telefon:</strong> {leader.phone or '-'}</li>
                <li><strong>Kostnadsval:</strong> {'Själv' if leader.cost_preference == 'self' else 'Haggai bidrar'}</li>
                <li><strong>Ankomst:</strong> {leader.arrival_date or '-'}</li>
                <li><strong>Avresa:</strong> {leader.departure_date or '-'}</li>
            </ul>
            <p>Gå till admin-panelen för att granska och godkänna registreringen.</p>
        </div>
        """
        
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"Ny ledarregistrering: {leader.name}",
            "html": admin_html
        })
    except Exception as e:
        logger.error(f"Failed to send admin notification: {e}")
    
    return {"message": "Registrering genomförd! Väntar på godkännande.", "leader_id": leader.id}


@api_router.get("/leader-registrations")
async def get_leader_registrations(status: Optional[str] = None):
    """Get all leader registrations (admin)"""
    query = {}
    if status:
        query["status"] = status
    registrations = await db.leader_registrations.find(query, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(500)
    return registrations


@api_router.get("/leader-registrations/{registration_id}")
async def get_leader_registration(registration_id: str):
    """Get a specific leader registration (admin)"""
    registration = await db.leader_registrations.find_one({"id": registration_id}, {"_id": 0, "password_hash": 0})
    if not registration:
        raise HTTPException(status_code=404, detail="Registrering hittades inte")
    return registration


@api_router.post("/leader-registrations/{registration_id}/approve")
async def approve_leader_registration(registration_id: str):
    """Approve a leader registration"""
    registration = await db.leader_registrations.find_one({"id": registration_id})
    if not registration:
        raise HTTPException(status_code=404, detail="Registrering hittades inte")
    
    if registration.get("status") == "approved":
        raise HTTPException(status_code=400, detail="Registreringen är redan godkänd")
    
    # Update status
    await db.leader_registrations.update_one(
        {"id": registration_id},
        {"$set": {
            "status": "approved",
            "approved_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Also create/update entry in main leaders collection for display
    leader_doc = {
        "id": registration_id,
        "name": registration['name'],
        "email": registration['email'],
        "phone": registration.get('phone'),
        "role": {
            "sv": registration.get('role_sv', ''),
            "en": registration.get('role_en', ''),
            "ar": registration.get('role_ar', '')
        },
        "bio": {
            "sv": registration.get('bio_sv', ''),
            "en": registration.get('bio_en', ''),
            "ar": registration.get('bio_ar', '')
        },
        "topics": {
            "sv": registration.get('topics_sv', []),
            "en": registration.get('topics_en', []),
            "ar": registration.get('topics_ar', [])
        },
        "image_url": registration.get('image_url'),
        "is_active": True,
        "is_registered_leader": True,
        "registration_id": registration_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Upsert to leaders collection
    await db.leaders.update_one(
        {"id": registration_id},
        {"$set": leader_doc},
        upsert=True
    )
    
    # Send approval email
    try:
        base_url = os.environ.get('FRONTEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')
        login_link = f"{base_url}/ledare/login"
        
        email_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #014D73 0%, #012d44 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Haggai Sweden</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Din registrering är godkänd!</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
                <p>Hej <strong>{registration['name']}</strong>,</p>
                
                <p>🎉 Grattis! Din registrering som ledare har nu blivit godkänd.</p>
                
                <p>Du har nu tillgång till:</p>
                <ul>
                    <li>Din ledarprofil</li>
                    <li>Workshop-agendor och program</li>
                    <li>Dina tilldelade sessioner</li>
                    <li>Dokumenthantering</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{login_link}" 
                       style="background: #014D73; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                        Logga in på ledarportalen
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #888; font-size: 12px;">
                    Haggai Sweden | <a href="https://haggai.se" style="color: #014D73;">haggai.se</a> (By Keeada)
                </p>
            </div>
        </div>
        """
        
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [registration['email']],
            "subject": "Din registrering är godkänd - Haggai Sweden",
            "html": email_html
        })
    except Exception as e:
        logger.error(f"Failed to send approval email: {e}")
    
    return {"message": "Ledaren har godkänts"}


@api_router.post("/leader-registrations/{registration_id}/reject")
async def reject_leader_registration(registration_id: str, reason: Optional[str] = None):
    """Reject a leader registration"""
    registration = await db.leader_registrations.find_one({"id": registration_id})
    if not registration:
        raise HTTPException(status_code=404, detail="Registrering hittades inte")
    
    await db.leader_registrations.update_one(
        {"id": registration_id},
        {"$set": {
            "status": "rejected",
            "admin_notes": reason,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Send rejection email
    try:
        email_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Haggai Sweden</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
                <p>Hej <strong>{registration['name']}</strong>,</p>
                
                <p>Tyvärr kunde vi inte godkänna din registrering som ledare vid detta tillfälle.</p>
                
                {f'<p><strong>Anledning:</strong> {reason}</p>' if reason else ''}
                
                <p>Om du har frågor, vänligen kontakta oss på info@haggai.se</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #888; font-size: 12px;">
                    Haggai Sweden | <a href="https://haggai.se" style="color: #014D73;">haggai.se</a> (By Keeada)
                </p>
            </div>
        </div>
        """
        
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [registration['email']],
            "subject": "Angående din registrering - Haggai Sweden",
            "html": email_html
        })
    except Exception as e:
        logger.error(f"Failed to send rejection email: {e}")
    
    return {"message": "Registreringen har avslagits"}


# --- Leader Portal (Login & Profile) ---

@api_router.post("/leaders/login")
async def leader_login(input: LeaderLogin):
    """Login for registered leaders"""
    leader = await db.leader_registrations.find_one({"email": input.email.lower()})
    if not leader:
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    
    if not leader.get("password_hash"):
        raise HTTPException(status_code=401, detail="Kontot är inte aktiverat")
    
    if not bcrypt.checkpw(input.password.encode('utf-8'), leader['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    
    if leader.get("status") != "approved":
        raise HTTPException(status_code=403, detail="Din registrering väntar fortfarande på godkännande")
    
    # Generate JWT token
    token_data = {
        "sub": leader['id'],
        "email": leader['email'],
        "name": leader['name'],
        "type": "leader",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "token": token,
        "leader": {
            "id": leader['id'],
            "name": leader['name'],
            "email": leader['email'],
            "image_url": leader.get('image_url')
        }
    }


@api_router.post("/leaders/me/documents")
async def upload_leader_document(
    document_type: str = None,
    filename: str = None,
    file_data: str = None,  # Base64 encoded
    authorization: str = Header(None)
):
    """Upload a document for the current leader"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Ej auktoriserad")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "leader":
            raise HTTPException(status_code=401, detail="Ogiltig token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    leader_id = payload['sub']
    
    if not document_type or not filename or not file_data:
        raise HTTPException(status_code=400, detail="document_type, filename och file_data krävs")
    
    # Valid document types
    valid_types = ["topic_material", "receipt", "travel_ticket", "profile_image", "other"]
    if document_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Ogiltig dokumenttyp. Giltiga: {valid_types}")
    
    document = {
        "id": str(uuid.uuid4()),
        "filename": filename,
        "type": document_type,
        "data": file_data,  # Store base64 in MongoDB
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }
    
    # If profile image, also update image_url field
    if document_type == "profile_image":
        # Create data URL for image
        # Detect mime type from filename
        ext = filename.lower().split('.')[-1]
        mime_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp'
        }
        mime_type = mime_types.get(ext, 'image/jpeg')
        data_url = f"data:{mime_type};base64,{file_data}"
        
        await db.leader_registrations.update_one(
            {"id": leader_id},
            {
                "$push": {"documents": document},
                "$set": {
                    "image_url": data_url,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Also update main leaders collection if approved
        leader = await db.leader_registrations.find_one({"id": leader_id})
        if leader and leader.get("status") == "approved":
            await db.leaders.update_one({"id": leader_id}, {"$set": {"image_url": data_url}})
    else:
        await db.leader_registrations.update_one(
            {"id": leader_id},
            {
                "$push": {"documents": document},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
    
    return {"message": "Dokument uppladdat", "document_id": document["id"]}


@api_router.delete("/leaders/me/documents/{document_id}")
async def delete_leader_document(document_id: str, authorization: str = Header(None)):
    """Delete a document"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Ej auktoriserad")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "leader":
            raise HTTPException(status_code=401, detail="Ogiltig token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    leader_id = payload['sub']
    
    await db.leader_registrations.update_one(
        {"id": leader_id},
        {
            "$pull": {"documents": {"id": document_id}},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    return {"message": "Dokument raderat"}


@api_router.get("/leaders/me/sessions")
async def get_current_leader_sessions(authorization: str = Header(None)):
    """Get all sessions assigned to the current leader"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Ej auktoriserad")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "leader":
            raise HTTPException(status_code=401, detail="Ogiltig token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")
    
    leader_id = payload['sub']
    
    # Get leader's email to match with sessions
    leader = await db.leader_registrations.find_one({"id": leader_id})
    if not leader:
        raise HTTPException(status_code=404, detail="Ledare hittades inte")
    
    # Find all agendas with sessions assigned to this leader
    all_agendas = await db.agenda.find({}, {"_id": 0}).to_list(100)
    
    sessions_with_workshop = []
    for agenda in all_agendas:
        workshop = await db.workshops.find_one({"id": agenda.get("workshop_id")}, {"_id": 0})
        if not workshop:
            continue
        
        for day in agenda.get("days", []):
            for session in day.get("sessions", []):
                # Check if this leader is assigned
                if session.get("leader_id") == leader_id or session.get("leader_id") == leader.get("email"):
                    sessions_with_workshop.append({
                        "session": session,
                        "day_date": day.get("date"),
                        "day_title": day.get("title"),
                        "workshop_id": agenda.get("workshop_id"),
                        "workshop_title": workshop.get("title"),
                        "workshop_date": workshop.get("date"),
                        "workshop_location": workshop.get("location")
                    })
    
    return sessions_with_workshop


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()