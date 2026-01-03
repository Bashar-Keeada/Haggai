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