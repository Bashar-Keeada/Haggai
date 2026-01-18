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
from datetime import datetime, timezone
import base64
import resend


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
    status: str = "pending"  # pending, approved, rejected, contacted
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


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
    """Send email to the nominated person"""
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
            
            <p style="margin-top: 30px;">Om du är intresserad av att delta i programmet, vänligen kontakta oss för mer information.</p>
            
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


@api_router.post("/board-meetings", response_model=BoardMeeting)
async def create_board_meeting(input: BoardMeetingCreate):
    """Create a new board meeting"""
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