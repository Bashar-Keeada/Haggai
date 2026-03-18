# Haggai Sweden - Product Requirements Document

## Original Problem Statement
Multi-page website for "Haggai Sweden" - a comprehensive full-stack application with React frontend, FastAPI backend, and MongoDB database. Features admin panels for content management, member portal, and workflows for nominating/registering workshop participants and facilitators.

## Core Architecture
- **Frontend**: React with Tailwind CSS, Shadcn/UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Email**: Resend API
- **PDF Generation**: ReportLab, Pillow, PyMuPDF

## User Personas
1. **Admin/Board Members** - Manage workshops, nominations, facilitators, members
2. **Members** - Access knowledge support, view facilitators, attend meetings
3. **Participants** - Register for workshops, complete training
4. **Facilitators/Trainers** - Lead workshops, access session materials

## Completed Features (as of 2026-03-17)

### This Session (2026-03-17/18) - Komplett deltagarflöde
- [x] **Public Workshop Registration** - Ny URL: `/anmal/{workshopId}`:
  - Samma formulär som nominering men öppet för alla
  - Nytt fält: "Vem rekommenderade dig?" (valfritt)
  - Backend endpoint: `POST /api/workshops/{id}/public-register`
- [x] **Admin QR-dialog uppgraderad**:
  - Visar BÅDA länkar: öppen anmälan (grön) + nominering (grå)
  - Varje länk har egen QR-kod
- [x] **Leader Document Upload → Link-based System**:
  - Ersatt filuppladdning med länkbaserat system (Google Drive, Dropbox)
  - Ny endpoint: `POST /api/leaders/me/documents/link`
- [x] **LeaderSessions.jsx Rebuilt** med token-autentisering
- [x] **Ny: AdminWorkshopParticipants.jsx** - Komplett deltagarhantering:
  - Statistik-kort (totalt, väntar, godkända, slutförda, certifikat)
  - Deltagarlista med sök och statusfilter
  - Gruppkommunikation (skicka e-post till alla)
  - Påminnelse-funktion
  - Session-baserad närvarospårning
  - Automatisk timräkning och certifikat vid 21h
- [x] **Backend endpoints för deltagarhantering**:
  - `GET /api/workshops/{id}/participants` - Lista deltagare
  - `GET /api/workshops/{id}/participants/stats` - Statistik
  - `POST /api/workshops/{id}/send-group-email` - Gruppmail
  - `POST /api/workshops/{id}/send-reminder` - Påminnelse
  - `POST /api/workshops/{id}/sessions/{sid}/attendance` - Registrera närvaro
  - `GET /api/workshops/{id}/sessions/{sid}/attendance` - Hämta närvaro
- [x] **Automatiskt certifikat vid 21h** - E-post skickas när deltagare når 21 timmar

### Previous Session (2026-03-14) - Nominee Workflow Enhancement
- [x] **Profile Image Upload** - Nominees can now upload profile picture directly from computer during registration (NomineeRegistration.jsx):
  - File input with image preview
  - Image validation (type & max 5MB size)
  - Base64 encoding for storage
  - Swedish/English/Arabic translations
- [x] **Password Creation Flow** - After admin approval, nominees create their own password:
  - New page: `/deltagare/skapa-losenord/{token}` (SetParticipantPassword.jsx)
  - Backend endpoints: `GET /api/participants/verify-password-token/{token}`, `POST /api/participants/set-password`
  - Email with password setup link sent instead of auto-generated password
  - Password token expires after 7 days
- [x] **Backend Flow Changes**:
  - `create_participant_account()` now creates `password_setup_token` instead of auto-password
  - `send_participant_password_setup_email()` - new function for password setup emails
  - Participant account starts inactive, activated when password is set

### Previous Session (2026-01-28)
- [x] **Board Member Management - FIXED** - Backend API endpoints now properly connected to frontend:
  - `POST /api/board-members` - Create new board member (with term_start)
  - `PUT /api/board-members/{id}/archive` - Archive existing member (with term_end query param)
  - `GET /api/board-members` - Fetch current board members
  - Frontend UI now properly saves new members and displays them
- [x] **Meeting Attendee Selection** - Board members shown as checkboxes when creating meetings
- [x] **External Attendee Email** - "Lägg till annan deltagare" now includes email field for non-board meeting invitees
- [x] **WhatsApp Invitations in Arabic** - WhatsApp messages are now ALWAYS in Arabic regardless of UI language
- [x] **Registration Links Default to Arabic** - All registration links now include `?lang=ar` to open in Arabic by default

### Previous Session (2026-01-27)
- [x] **Member Area Pages Redesign** - All 6 section buttons now navigate to separate pages:
  - `/medlemmar/enhet` - Vår Enhet (rose color)
  - `/medlemmar/utbildningar` - Utbildningar (blue color)
  - `/medlemmar/facilitatorer` - Facilitatorer (amber color)
  - `/medlemmar/karnamnen` - Kärnämnen (purple color)
  - `/medlemmar/stadgar` - Stadgar (emerald color)
  - `/medlemmar/styrelse` - Styrelse (indigo color)
- [x] **Compact Design** - All member pages have minimal whitespace, smaller text, same design language
- [x] **MembersArea Main Page** - Now shows 6 clickable cards in a horizontal grid + Meetings section
- [x] **Admin Create Nomination** - New "Skapa nominering" button in AdminNominations with full form dialog
- [x] **Name Badge Redesign** - Role-specific designs with QR codes, Haggai branding
- [x] **"Leader" to "Facilitator" Terminology** - Updated throughout codebase
- [x] **Email Language Default** - Arabic as default for all invitation emails
- [x] **Admin Back Buttons** - Consistent navigation across admin pages

### Previous Sessions
- [x] Workshop management system
- [x] Nomination workflow (public form + admin approval)
- [x] Facilitator/Leader registration and management
- [x] Member portal with authentication
- [x] Board meetings management
- [x] PDF name badge generation
- [x] Multi-language support (Swedish, English, Arabic)
- [x] Email notifications via Resend

## Upcoming Tasks (P1)

1. **Admin Categories Panel** - UI för managing "Expertise" and "Interest" options
2. **LeaderExperience.jsx Refactor** - Migrate from mock.js to `/api/workshops` endpoint
3. **Admin panel for managing approved nominees** - Group management tools

## Known Issues

### Production Environment (haggai.se)
- **Invitation links pointing to preview** - Environment configuration issue, requires Emergent Support
- **Leader registration link broken** - Same root cause as above

## Future/Backlog Tasks (P2-P3)

- Agenda notifications for participants
- Email reminders for board meetings
- PDF export for meeting agendas/minutes
- Online payment integration (Stripe)

## Key API Endpoints
- `GET /api/nominations` - List all nominations
- `POST /api/nominations` - Create new nomination
- `POST /api/nominations/{id}/approve` - Approve and send invitation
- `GET /api/workshops` - List workshops
- `GET /api/leader-registrations?status=approved` - Get active facilitators
- `GET /api/members/me` - Get current member (supports Bearer token)

## Database Collections
- `nominations` - Workshop participant nominations
- `workshops` - Training workshops
- `leader_registrations` - Approved facilitators
- `members` - Portal members
- `board_meetings` - Meeting schedules
- `board_members` - Board composition

## Test Credentials
- **Board Admin Password**: `Haggai2030!`
- **Member Test User**: `bashar@officeo.se` / `test123`

## Notes
- Member token stored in localStorage as `memberToken` (not `member_token`)
- Facilitators fetched from `leader_registrations` collection, NOT `leaders`
- All nomination emails default to Arabic language
