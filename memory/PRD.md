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
- **Nominations** ✅ NEW - View and manage nominations with statistics
- **Board Meetings** ✅ NEW - Plan and document board meetings with agenda
- **Workshops** ✅ NEW - Manage workshops with pricing (`/admin/workshops`)

### Technical Stack
- **Frontend:** React, React Router, TailwindCSS, Shadcn/UI
- **Backend:** FastAPI, Pydantic
- **Database:** MongoDB
- **Internationalization:** Custom context-based (SV/EN/AR with RTL)

---

## What's Been Implemented

### January 2026

#### Board Meeting System ✅ (Latest)
- **Location:** Members Area → under "Stadgar" section
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
- **Board Member Authentication:** ✅ NEW
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
- `/app/frontend/src/pages/EventCalendar.jsx` - Calendar with nomination button
- `/app/frontend/src/pages/AdminNominations.jsx` - Admin panel for nominations
- `/app/frontend/src/pages/Donations.jsx` - Donations page
- `/app/frontend/src/pages/AdminDashboard.jsx` - Main admin hub
- `/app/backend/server.py` - All API endpoints including nominations

---

## API Endpoints
- `GET/POST/PUT/DELETE /api/leaders`
- `GET/POST/PUT/DELETE /api/board-members`
- `POST /api/board-auth/login` ✅ NEW - Board member login
- `POST /api/board-auth/set-password` ✅ NEW - Set password for board member
- `GET /api/board-auth/check-email/{email}` ✅ NEW - Check if email is board member
- `GET /api/board-auth/me` ✅ NEW - Get current logged in board member
- `GET/POST/PUT/DELETE /api/organization-members`
- `GET/POST/PUT/DELETE /api/partners`
- `GET/POST/PUT/DELETE /api/testimonials`
- `GET/POST/PUT/DELETE /api/nominations`
- `GET /api/nominations/stats`
- `GET/POST/PUT/DELETE /api/board-meetings`
- `GET /api/board-meetings/archived`
- `PUT /api/board-meetings/{id}/archive`
- `POST /api/board-meetings/{id}/send-invitation` ✅ NEW - Send meeting invitation
- `POST /api/board-meetings/{id}/send-reminder` ✅ NEW - Send meeting reminder
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
