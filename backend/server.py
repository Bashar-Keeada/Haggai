from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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


@api_router.post("/nominations", response_model=Nomination)
async def create_nomination(input: NominationCreate):
    """Create a new nomination"""
    nomination = Nomination(**input.model_dump())
    doc = nomination.model_dump()
    await db.nominations.insert_one(doc)
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