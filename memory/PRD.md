# Haggai Sweden - Product Requirements Document

## Original Problem Statement
Build a multi-page website for "Haggai Sweden" - a Christian leadership organization that is part of Haggai International. The site should support Swedish, English, and Arabic languages with RTL support.

## Core Requirements

### Structure
- Multi-page website with password protection
- Two-tier authentication: main site password + members-only area password
- Responsive design with mobile support

### Pages
1. **Home** - Hero section, core values, testimonials, upcoming events
2. **About Us** - Mission, vision, board of directors
3. **Leader Experience** - Programs and application forms
4. **Leaders** - Directory of leaders/facilitators
5. **Partners** - Strategic partners page
6. **Event Calendar** - Upcoming events with registration + **NOMINATION FEATURE** ✅
7. **Membership** - Application forms for individuals, churches, organizations
8. **Contact** - Contact form and info
9. **Members Area** - Protected area with additional resources
10. **Donations** - Support page with Swish and bank transfer options ✅
11. **Admin Panels** - Manage all dynamic content including nominations

### Admin Panels
- Leaders/Facilitators management
- Board of Directors (current/archived)
- Form submissions (applications, contact)
- Organization/Church members
- Partners
- Testimonials
- **Nominations** ✅ - View and manage nominations with statistics
- **Board Meetings** ✅ - Plan and document board meetings with agenda
- **Workshops** ✅ - Manage workshops with pricing (`/admin/workshops`)
- **Training Participants** ✅ - Manage registrations, attendance & diplomas (`/admin/utbildning`)
- **Categories** ✅ NEW - Manage expertise & interest categories for member profiles

### Member Portal ✅ NEW
- **Member Login** (`/medlem-login`) - Automatic account creation when diploma is sent
- **Mina Sidor** (`/mina-sidor`) - Member dashboard with profile, messages, diplomas
- **Member Profile** (`/mina-sidor/profil`) - Edit profile, expertise, interests, profile image
- **Member Directory** (`/mina-sidor/medlemmar`) - View all members
- **Direct Messages** (`/mina-sidor/meddelanden`) - Chat with other members
- **Discussion Forum** (`/mina-sidor/forum`) - Community forum for discussions
- **My Diplomas** (`/mina-sidor/diplom`) - View earned diplomas

### Technical Stack
- **Frontend:** React, React Router, TailwindCSS, Shadcn/UI
- **Backend:** FastAPI, Pydantic
- **Database:** MongoDB
- **Internationalization:** Custom context-based (SV/EN/AR with RTL)

---

## What's Been Implemented

### January 2026

#### Complete Member Portal System ✅ NEW (Jan 24)
- **Location:** `/medlem-login`, `/mina-sidor/*`
- **Features:**
  - **Automatic Member Creation:** When diploma is sent, member account is created automatically
  - **Welcome Email:** New members receive email with login credentials
  - **Member Dashboard:** Overview with profile summary, messages, diplomas
  - **Profile Management:** Edit profile, upload image, select expertise & interests
  - **Member Directory:** View all members with their profiles
  - **Direct Messages:** Private chat between members with email notifications
  - **Discussion Forum:** Community forum for posts and replies
  - **My Diplomas:** View all earned diplomas
- **API Endpoints:**
  - `POST /api/members/login` - Member authentication
  - `GET /api/members/me` - Get current member
  - `PUT /api/members/me` - Update profile
  - `GET /api/members` - List all members
  - `GET /api/members/{id}` - Get member profile
  - `POST /api/messages` - Send direct message
  - `GET /api/messages` - Get conversations
  - `GET /api/messages/{partner_id}` - Get conversation with partner
  - `POST /api/forum` - Create forum post
  - `GET /api/forum` - List forum posts
  - `GET /api/forum/{post_id}` - Get post with replies
  - `POST /api/forum/{post_id}/reply` - Reply to post
  - `GET /api/categories` - Get expertise/interest categories
  - `POST /api/categories` - Add new category (admin)
- **Tests:** Manual testing completed ✅

#### Training Participants Admin Panel ✅ (Jan 18)
- **Location:** `/admin/utbildning`
- **Features:**
  - Dashboard showing all people who registered via nomination link
  - Statistics cards: Total registered, Pending, Accepted, Rejected, Completed
  - Filter buttons for each status
  - View full registration form for each participant
  - Accept/reject registrations
  - Log attendance hours (0-21)
  - Automatic status change to "Completed" at 21 hours
  - PDF diploma generation (based on certificate template)
  - Automatic email sending of diploma with PDF attachment
- **API Endpoints:**
  - `GET /api/training-participants` - List all registered participants
  - `GET /api/training-participants/{id}` - Get specific participant
  - `PUT /api/training-participants/{id}/status` - Accept/reject
  - `PUT /api/training-participants/{id}/attendance` - Update hours
  - `POST /api/training-participants/{id}/generate-diploma` - Download PDF
  - `POST /api/training-participants/{id}/send-diploma` - Email diploma
- **Diploma Design:**
  - "ADVANCED LEADERSHIP SEMINAR" header
  - Event title and date
  - Participant name (large, centered)
  - Haggai International completion text
  - Two signatures: CEO + Association President
- **Tests:** 13 backend tests passing (100%)

#### Nominee Registration System ✅ (Jan 18)
- **Location:** `/registrering/:nominationId` (public, no login required)
- **Features:**
  - Motivating intro text about the training purpose (trilingual: SV/EN/AR)
  - Pre-filled nominee name and email from nomination
  - Comprehensive registration form with:
    - Personal info (name, gender, DOB, phone, email, address, marital status, birthplace)
    - Work info (field, profession, employer)
    - Church info (church name, role)
    - Commitments (attendance, active participation)
    - Fee info (1200 SEK) with detailed breakdown
    - Financial support request option
    - Additional notes
  - Email notification to admin when registration is submitted
  - Registration link included in nomination email to nominee
- **API Endpoints:**
  - `GET /api/nominations/{id}` - Get nomination details
  - `POST /api/nominations/{id}/register` - Submit registration

#### Members Area Redesign ✅ (Jan 18)
- New collapsible sections with color-coded headers:
  - 🔴 **Vår Enhet** (Our Unity) - Motivating text about engagement and responsibility
  - 🔵 **Kommande Utbildningar** (Upcoming Trainings) - Workshop list with nominate buttons
  - 🟢 **Kärnämnen** (Core Subjects) - 21 hours, certified workshop with diploma
  - 🔵 **Föreningens Stadgar** (Bylaws) - 9 sections
  - 🟣 **Nuvarande Styrelse** (Current Board) - Board members
  - 🟠 **Styrelsearbete** (Board Work) - Meeting management
- Haggai International global vision shown less prominently
- Removed "Evangelisation" from core subjects

#### Multilingual Workshop Support ✅ (Jan 18)
- All workshops now support Swedish, English, and Arabic titles
- Target groups added: Men, Women, All
- Workshop types: International, National, Online, ToT
- Calendar displays correct language based on user selection

#### UI Improvements ✅ (Jan 18)
- **Event Calendar:** Price now displayed as green badge on workshop cards (500 USD/SEK)
- **Members Area:** Completely redesigned with categorized collapsible sections:
  - 🟢 Kunskapsstöd (Knowledge Support) - Core subjects with hours
  - 🔵 Stadgar (Bylaws) - Association rules
  - 🟣 Styrelse (Board) - Current board members
  - 🟠 Styrelsemöten (Board Meetings) - Meeting management
- Uses Radix UI Collapsible component for smooth expand/collapse
- Color-coded headers for easy identification

#### Workshop Management ✅ (Jan 18)
- **Location:** `/admin/workshops`
- **Features:**
  - View all workshops with type badges (ToT, Online, National, International)
  - Full CRUD operations (Create, Read, Update, Delete)
  - Price and currency management (SEK, USD, EUR)
  - Multi-language titles (Swedish, English, Arabic)
  - Workshop types: ToT (Training of Trainers), Online, National, International
  - Target groups: All, Women, Men
  - Date ranges, locations, spots, age limits
  - Active/inactive status toggle
- **API Endpoints:**
  - `GET /api/workshops` - List all workshops
  - `POST /api/workshops` - Create workshop
  - `PUT /api/workshops/{id}` - Update workshop
  - `DELETE /api/workshops/{id}` - Delete workshop
  - `POST /api/workshops/seed-initial` - Seed initial data
- **Bug Fixed:** Price field validation allowing null values from database

#### Board Meeting System ✅
- **Location:** Members Area → Styrelsemöten section
- **Features:**
  - Create new board meetings with title, date, time, location
  - Add attendees and agenda items
  - Each agenda item has: title, description, responsible person, status
  - Status tracking: Scheduled → In Progress → Completed → Archived
  - Expand/collapse meeting details
  - Edit meeting and update agenda item statuses
  - Add decisions and notes per agenda item
  - Archive completed meetings
  - View archived meetings separately
- **Board Member Authentication:** ✅
  - Login with email + password
  - First-time account setup (set password)
  - JWT-based authentication
  - Only logged-in board members can edit meetings
- **Email Notifications:** ✅ NEW
  - Auto-send meeting invitation when new meeting created
  - Manual "Skicka kallelse" button to re-send invitations
  - "Skicka påminnelse" button for reminders
  - Emails include: meeting details, agenda, link to members area
- Full i18n support (Swedish, English, Arabic)

#### Email Notifications ✅
- Integrated Resend email service
- Automatic emails sent when nominations are submitted:
  - To nominee: Full nomination details with motivering
  - To admin (info@haggai.se): Notification with link to admin panel
- Sender: noreply@haggai.se

#### Nomination System ✅
- **Nominate Button** on Leader Experience events in Calendar
- **Nomination Form** with:
  - Nominator info (name, email, phone)
  - Nominee info (name, email, phone)
  - Auto-selected training/event
  - Motivation text field
- **Backend API:** Full CRUD for nominations (`/api/nominations`)
- **Statistics API:** Get nomination stats (`/api/nominations/stats`)
- **Admin Panel** (`/admin/nomineringar`) with:
  - Statistics dashboard (total, pending, approved, rejected, contacted)
  - Top nominators list
  - Nominations by event
  - Filter by status
  - Search functionality
  - Approve/Reject/Contact actions
- Multi-language support (SV/EN/AR)

#### Donations Page ✅
- Created `/donera` route with full UI
- Swish payment with test number display
- Bank transfer details
- One-time and recurring gift options
- Full i18n support

#### Previous Work (From Handoff)
- Board Member Management (CRUD, active/archived)
- Partner & Organization Management
- Testimonial Management with admin panel
- Approve/Reject Application functionality
- Dual Password System (site + members area)
- Core Subjects modal in Members Area

---

## Credentials
- **Website Password:** `Keeada2030`
- **Members Area Password:** `Haggai2030!`

---

## Prioritized Backlog

### P0 (Critical) - None currently

### P1 (High Priority)
- ✅ COMPLETED: Workshop Management Admin Panel
- ✅ COMPLETED: Training Participants Admin Panel with Diploma Generation
- Migrate EventCalendar.jsx to use /api/workshops instead of mock.js
- Migrate LeaderExperience.jsx to use /api/workshops instead of mock.js

### P2 (Medium Priority)
- Update Swish/bank details when user provides real numbers
- QR code integration for Swish
- Email notifications for form submissions

### P3 (Low Priority/Future)
- Online payment integration (Stripe/PayPal)
- User accounts and login
- Newsletter subscription system
- PDF export for board meetings

---

## Key Files Reference
- `/app/frontend/src/pages/AdminTrainingParticipants.jsx` - Training participant management ✅ NEW
- `/app/frontend/src/pages/AdminWorkshops.jsx` - Workshop management admin panel
- `/app/frontend/src/pages/EventCalendar.jsx` - Calendar with nomination button
- `/app/frontend/src/pages/AdminNominations.jsx` - Admin panel for nominations
- `/app/frontend/src/pages/Donations.jsx` - Donations page
- `/app/frontend/src/pages/AdminDashboard.jsx` - Main admin hub
- `/app/backend/server.py` - All API endpoints including training participants
- `/app/tests/test_training_participants.py` - API tests ✅ NEW

---

## API Endpoints
- `GET/POST/PUT/DELETE /api/leaders`
- `GET/POST/PUT/DELETE /api/board-members`
- `POST /api/board-auth/login` - Board member login
- `POST /api/board-auth/set-password` - Set password for board member
- `GET /api/board-auth/check-email/{email}` - Check if email is board member
- `GET /api/board-auth/me` - Get current logged in board member
- `GET/POST/PUT/DELETE /api/organization-members`
- `GET/POST/PUT/DELETE /api/partners`
- `GET/POST/PUT/DELETE /api/testimonials`
- `GET/POST/PUT/DELETE /api/nominations`
- `GET /api/nominations/stats`
- `GET/POST/PUT/DELETE /api/board-meetings`
- `GET /api/board-meetings/archived`
- `PUT /api/board-meetings/{id}/archive`
- `POST /api/board-meetings/{id}/send-invitation` - Send meeting invitation
- `POST /api/board-meetings/{id}/send-reminder` - Send meeting reminder
- `GET /api/training-participants` ✅ NEW - List registered participants
- `GET /api/training-participants/{id}` ✅ NEW - Get specific participant
- `PUT /api/training-participants/{id}/status` ✅ NEW - Update status
- `PUT /api/training-participants/{id}/attendance` ✅ NEW - Update attendance
- `POST /api/training-participants/{id}/generate-diploma` ✅ NEW - Generate PDF
- `POST /api/training-participants/{id}/send-diploma` ✅ NEW - Email diploma
- `GET/POST/PUT /api/applications/leader-experience`
- `GET/POST /api/applications/membership`
- `GET/POST /api/applications/contact`

---

## Database Collections
- `leaders`
- `board_members`
- `organization_members`
- `partners`
- `testimonials`
- `nominations` ✅ NEW
- `board_meetings` ✅ NEW
- `leader_experience_applications`
- `membership_applications`
- `contact_submissions`

---

## Known Mocked Data
- Leader Experience programs are loaded from `/app/frontend/src/data/mock.js` (not database)
