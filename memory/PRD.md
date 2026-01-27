# Haggai Sweden - Product Requirements Document

## Original Problem Statement
Create a multi-page, password-protected website for "Haggai Sweden" with comprehensive admin panels, member portal, and workshop management features.

## Core Features Implemented

### Authentication & Access Control
- [x] Password-protected website (password: Haggai2030)
- [x] Member Portal ("Mina Sidor") with JWT authentication
- [x] Leader Portal with separate authentication
- [x] Participant Portal with approval workflow
- [x] Board Member Admin access (password: Haggai2030!)

### Admin Panels
- [x] Leaders management
- [x] Board Members management
- [x] Form submissions management
- [x] Organization members management
- [x] Partners management
- [x] Testimonials management
- [x] Workshops management (CRUD operations)
- [x] Nominations management with approval workflow
- [x] Name badges management (A6 PDF format)

### Workshop System
- [x] Create/Edit/Delete workshops
- [x] Multi-language support (Swedish, English, Arabic)
- [x] Shareable nomination links with QR codes
- [x] Workshop agenda system with multi-day schedules
- [x] Session evaluation system with anonymous ratings

### Member Features
- [x] Profile editing
- [x] Member directory
- [x] Private messaging
- [x] Forum
- [x] Password reset functionality

### Participant Workflow
- [x] Public nomination form
- [x] Admin-moderated approval workflow
- [x] Registration link sent upon approval
- [x] Participant Portal access after registration
- [x] Name badge generation
- [x] Password reset functionality

### Leader Workflow
- [x] Email invitation system
- [x] Multi-lingual registration form
- [x] Document upload capabilities
- [x] Expertise selection from predefined list
- [x] Leader Portal with profile management
- [x] Name badge generation

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS, Shadcn/UI, Lucide React
- **Backend:** FastAPI, Pydantic, ReportLab (PDFs)
- **Database:** MongoDB
- **Email:** Resend API
- **QR Codes:** qrcode.react

## Recent Changes (January 2026)

### Bug Fixes
- [x] **Calendar sync issue** - EventCalendar.jsx now fetches from API instead of mock data
- [x] Participant login endpoint fixed
- [x] Share nomination link functionality fixed
- [x] Agenda display colors fixed
- [x] Backend syntax/indentation errors resolved

### Features Added
- [x] Name badge system (A6 PDF format)
- [x] Participant Portal with approval workflow
- [x] Password reset for Members and Participants
- [x] Photo upload for leader/nominee registration

## Pending Issues

### P0 (Critical)
1. **Allow multiple leader invitations to same email** - NOT STARTED
2. **Deployment blocked** - Production has empty database, needs data migration

### P1 (High Priority)
3. **Custom donation amount** - Add input field on /donations page (IN PROGRESS)
4. **Gender icon alignment** - Minor UI fix (NOT STARTED)

### P2 (Medium Priority)
5. Implement LeaderSessions.jsx (leader-specific view)
6. Admin panel for Expertise/Interest categories
7. Refactor LeaderExperience.jsx to use API instead of mock data

## Technical Debt
- **CRITICAL:** `backend/server.py` is over 5000 lines - needs to be split into APIRouter modules
- Frontend linting warnings should be addressed
- Hardcoded URL fallbacks in server.py should be removed

## Database Collections
- `members` - Full organization members
- `participants` - Training participants (approved nominees)
- `nominations` - Nomination records with status workflow
- `workshops` - Workshop definitions
- `agendas` - Workshop schedules
- `leaders` - Certified leaders
- `leader_invitations` - Pending leader invitations
- `leader_registrations` - Leader registration data
- `password_resets` - Password reset tokens

## Credentials for Testing
- Website: `Haggai2030`
- Board Admin: `Haggai2030!`
- Test Member: `bashar@officeo.se` / `test123`
- Test Member: `test@haggai.se` / `test123`

## Known Issues
- Deployment to production fails due to empty database
- Production environment needs data migration from preview
- User should contact Emergent support on Discord for assistance
