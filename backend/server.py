from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
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
    # Nominator info (the person nominating)
    nominator_name: str
    nominator_email: str
    nominator_phone: Optional[str] = None
    # Nominee info (the person being nominated)
    nominee_name: str
    nominee_email: str
    nominee_phone: Optional[str] = None
    # Additional info
    motivation: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected, contacted, registered
    registration_completed: bool = False
    registration_data: Optional[dict] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class NomineeRegistrationData(BaseModel):
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
    nominator_name: str
    nominator_email: str
    nominator_phone: Optional[str] = None
    nominee_name: str
    nominee_email: str
    nominee_phone: Optional[str] = None
    motivation: Optional[str] = None


class NominationUpdate(BaseModel):
    status: Optional[str] = None
    motivation: Optional[str] = None


# ==================== EMAIL FUNCTIONS ====================

async def send_nomination_email_to_nominee(nomination: Nomination):
    """Send email to the nominated person with registration link"""
    # Get the frontend URL from env or use default
    frontend_url = os.environ.get('FRONTEND_URL', 'https://training-admin-1.preview.emergentagent.com')
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
    """Create a new nomination and send emails"""
    nomination = Nomination(**input.model_dump())
    doc = nomination.model_dump()
    await db.nominations.insert_one(doc)
    
    # Send emails asynchronously (don't wait for them to complete)
    asyncio.create_task(send_nomination_email_to_nominee(nomination))
    asyncio.create_task(send_nomination_email_to_admin(nomination))
    
    return nomination


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
        "status": "registered",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.nominations.update_one({"id": nomination_id}, {"$set": update_data})
    
    # Send notification email to admin about the registration
    try:
        await send_registration_email_to_admin(nomination, registration)
    except Exception as e:
        logging.error(f"Failed to send registration email: {e}")
    
    return {"message": "Registration completed successfully", "nomination_id": nomination_id}


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


@api_router.get("/workshops", response_model=List[Workshop])
async def get_workshops(active_only: bool = True, workshop_type: Optional[str] = None):
    """Get all workshops"""
    query = {}
    if active_only:
        query["is_active"] = True
    if workshop_type:
        query["workshop_type"] = workshop_type
    
    workshops = await db.workshops.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return workshops


@api_router.get("/workshops/{workshop_id}", response_model=Workshop)
async def get_workshop(workshop_id: str):
    """Get a specific workshop"""
    workshop = await db.workshops.find_one({"id": workshop_id}, {"_id": 0})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return workshop


@api_router.put("/workshops/{workshop_id}", response_model=Workshop)
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