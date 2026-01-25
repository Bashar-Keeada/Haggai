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
- **Workshop Agenda** ✅ NEW - Create program/schedule for workshops (`/admin/workshops/{id}/agenda`)
- **Training Participants** ✅ - Manage registrations, attendance & diplomas (`/admin/utbildning`)
- **Categories** ✅ NEW - Manage expertise & interest categories for member profiles

### Workshop Agenda System ✅ NEW (Jan 24)
- **Admin Agenda Editor** (`/admin/workshops/{id}/agenda`)
  - Create multi-day programs with sessions
  - Each session: start time, end time, title, description, leader assignment
  - Session types: Session, Break, Lunch, Registration, Other
  - Color-coded session badges
  - Save draft or publish & notify participants
  - Send day reminders to participants
- **Public Program View** (`/program/{workshop_id}`)
  - Beautiful program display for participants
  - Shows all days with sessions
  - Print-friendly view
  - Accessible via link in email notifications
- **Email Notifications**
  - Auto-notify participants when agenda is published
  - Day reminders (day before + morning of)
- **Leader Sessions View** (`/ledare/{id}/sessioner`)
  - Leaders can see their assigned sessions

### Session Evaluation System ✅ NEW (Jan 25)
- **Admin Question Management** (`/admin/utvardering/fragor`)
  - CRUD for evaluation questions with multilingual support (SV/EN/AR)
  - Questions can be activated/deactivated
  - Custom ordering
- **Participant Evaluation Form** (`/utvardering/{workshop_id}/{session_id}`)
  - Public form accessible via email link or QR code
  - Rating scale 1-10 with color-coded buttons (red/yellow/green)
  - Anonymous for leaders, traceable by admin
  - Optional comments and email
- **Admin Evaluation Results** (`/admin/utvardering`)
  - Overall statistics with averages
  - Per-question breakdown with progress bars
  - Leader comparison with ranking
  - Per-session breakdown
  - Filter by workshop and leader
  - Identify strengths (≥8) and improvement areas (<7)
- **Admin Feedback System**
  - Send personalized feedback to leaders via email
  - Choose feedback type: Praise, Improvement, General
  - Optionally include statistics in email
  - Feedback history tracking
- **API Endpoints:**
  - `GET/POST/PUT/DELETE /api/evaluation-questions` - Question CRUD
  - `POST /api/evaluations` - Submit evaluation
  - `GET /api/evaluations/stats` - Get statistics with filters
  - `GET /api/evaluations/leader/{id}/detailed` - Detailed leader stats
  - `POST /api/evaluations/feedback` - Send feedback email
  - `GET /api/evaluation/form/{workshop_id}/{session_id}` - Form data
- **Tests:** 25 backend API tests passing (100%)

### Shareable Nomination Link & QR Code ✅ NEW (Jan 25)
- **Admin Workshop Page** (`/admin/workshops`)
  - "Dela nomineringslänk" button - copies workshop nomination link to clipboard
  - "Visa QR-kod" button - opens modal with QR code for the workshop
  - QR modal shows: workshop title, QR code, nomination link, copy button, download button
  - Download QR code as PNG image
- **Public Nomination Form** (`/nominera/{workshop_id}`)
  - Public page accessible via link or QR code scan
  - Shows workshop information (title, date, location)
  - Complete nomination form with nominator and nominee sections
  - Admin moderation note displayed
  - Multilingual support (SV/EN/AR)
- **Technical Details:**
  - Uses `qrcode.react` library for QR code generation
  - QR code: 200x200 pixels, high error correction
  - Download format: PNG 300x300 pixels
- **Tests:** 11 backend + full frontend UI tests passing (100%)

### Member Portal ✅
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

#### Nomination System ✅ ENHANCED (Jan 24)
- **Admin-Moderated Workflow** ✅ NEW
  - Nominations now go to "pending" status first
  - Admin reviews and approves/rejects before nominee receives invitation
  - Approval triggers email invitation to nominee with registration link
  - Rejection stores reason in admin_notes
- **Nominate Button** on Leader Experience events in Calendar
- **Enhanced Nomination Form** with:
  - **Nominator info:** name, email, phone, church/congregation, relation to nominee ✅ NEW
  - **Nominee info:** name, email, phone, church/congregation ✅ NEW, role/responsibility ✅ NEW, activities/engagement ✅ NEW
  - Auto-selected training/event
  - **Motivation text field** (detailed explanation of why nominating)
- **Backend API:** Full CRUD for nominations (`/api/nominations`)
  - `POST /api/nominations` - Creates with status "pending"
  - `POST /api/nominations/{id}/approve` - Approves and sends invitation email ✅ NEW
  - `POST /api/nominations/{id}/reject` - Rejects with optional reason ✅ NEW
- **Statistics API:** Get nomination stats (`/api/nominations/stats`)
- **Admin Panel** (`/admin/nomineringar`) with:
  - Statistics dashboard (total, pending, approved, rejected, contacted)
  - Top nominators list
  - Nominations by event breakdown
  - Filter by status buttons
  - Search functionality
  - **New fields displayed:** Kyrka/församling, Roll/ansvar, Aktiviteter, Motivering ✅ NEW
  - **Approve dialog** with confirmation and nominee details ✅ NEW
  - **Reject dialog** with optional reason field ✅ NEW
  - Delete nomination button
- **Email Flow:**
  1. Nomination created → Admin notified, Nominator receives confirmation
  2. Admin approves → Nominee receives invitation email with registration link
  3. Admin approves → Nominator notified of approval
- Multi-language support (SV/EN/AR)
- **Tests:** 12 backend API tests passing (100%), Frontend UI verified ✅

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
- ✅ COMPLETED: Admin-Moderated Nomination Workflow with new fields (Jan 24)
- ✅ COMPLETED: Workshop Agenda System (Jan 24)
- ✅ COMPLETED: Session Evaluation System (Jan 25)
- ✅ COMPLETED: Shareable Nomination Link & QR Code (Jan 25)
- **Admin Panel for Categories** - Create UI to manage expertise/interest options for member profiles
- **Implement LeaderSessions.jsx** - Show logged-in leader their assigned sessions across workshops
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
- `/app/frontend/src/pages/AdminTrainingParticipants.jsx` - Training participant management ✅
- `/app/frontend/src/pages/AdminWorkshops.jsx` - Workshop management admin panel
- `/app/frontend/src/pages/AdminWorkshopAgenda.jsx` - Workshop agenda editor ✅ NEW
- `/app/frontend/src/pages/PublicAgenda.jsx` - Public program view for participants ✅ NEW
- `/app/frontend/src/pages/LeaderSessions.jsx` - Leader's assigned sessions ✅ NEW
- `/app/frontend/src/pages/AdminEvaluationQuestions.jsx` - Manage evaluation questions ✅ NEW
- `/app/frontend/src/pages/AdminEvaluationResults.jsx` - View evaluation results & send feedback ✅ NEW
- `/app/frontend/src/pages/SessionEvaluationForm.jsx` - Public evaluation form ✅ NEW
- `/app/frontend/src/pages/EventCalendar.jsx` - Calendar with nomination button & enhanced form ✅ UPDATED
- `/app/frontend/src/pages/AdminNominations.jsx` - Admin panel for nominations with approve/reject ✅ UPDATED
- `/app/frontend/src/pages/Donations.jsx` - Donations page
- `/app/frontend/src/pages/AdminDashboard.jsx` - Main admin hub
- `/app/backend/server.py` - All API endpoints ✅ UPDATED
- `/app/backend/tests/test_nominations.py` - Nomination API tests (12 tests) ✅
- `/app/backend/tests/test_agenda.py` - Agenda API tests (16 tests) ✅ NEW
- `/app/backend/tests/test_evaluations.py` - Evaluation API tests (25 tests) ✅ NEW

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
- `POST /api/nominations/{id}/approve` ✅ - Approve nomination and send invitation
- `POST /api/nominations/{id}/reject` ✅ - Reject nomination
- `GET/POST/PUT/DELETE /api/board-meetings`
- `GET /api/board-meetings/archived`
- `PUT /api/board-meetings/{id}/archive`
- `POST /api/board-meetings/{id}/send-invitation` - Send meeting invitation
- `POST /api/board-meetings/{id}/send-reminder` - Send meeting reminder
- `GET /api/workshops` ✅ - List workshops
- `GET/POST /api/workshops/{id}/agenda` ✅ NEW - Get/create agenda
- `PUT /api/workshops/{id}/agenda/publish` ✅ NEW - Publish agenda
- `GET /api/agenda/public/{id}` ✅ NEW - Public agenda view
- `POST /api/workshops/{id}/agenda/send-reminder` ✅ NEW - Send day reminder
- `GET /api/leaders/{id}/sessions` ✅ NEW - Leader's assigned sessions
- `GET /api/training-participants` ✅ - List registered participants
- `GET /api/training-participants/{id}` ✅ - Get specific participant
- `PUT /api/training-participants/{id}/status` ✅ - Update status
- `PUT /api/training-participants/{id}/attendance` ✅ - Update attendance
- `POST /api/training-participants/{id}/generate-diploma` ✅ - Generate PDF
- `POST /api/training-participants/{id}/send-diploma` ✅ - Email diploma
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
