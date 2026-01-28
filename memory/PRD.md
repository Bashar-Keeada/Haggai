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

## Completed Features (as of 2025-01-28)

### This Session
- [x] **MembersArea Redesign** - Compact horizontal grid layout with 6 clickable cards, reduced whitespace, smaller title
- [x] **Admin Create Nomination** - New "Skapa nominering" button in AdminNominations with full form dialog
- [x] **Name Badge Redesign** - Role-specific designs with QR codes, Haggai branding
- [x] **"Leader" to "Facilitator" Terminology** - Updated throughout codebase
- [x] **Member-Only Facilitator Page** - `/medlemmar/facilitatorer` for logged-in members only
- [x] **Member Badge Bug Fix** - Fixed token handling, database references
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

## Known Issues

### P0 - Critical
- **Deployment Database Separation**: Production (`haggai.se`) and preview (`haggai-members.preview.emergentagent.com`) use separate databases. Data entered on production is NOT visible in preview environment. **Requires Emergent Support for data migration.**

### P1 - High
- None currently

### P2 - Medium
- Workshop deactivation perceived as not working (likely browser cache - advise hard refresh)

## Upcoming Tasks (P1)

1. **LeaderSessions.jsx** - Implement facilitator-specific view showing assigned sessions
2. **Admin Categories Panel** - UI for managing "Expertise" and "Interest" options
3. **LeaderExperience.jsx Refactor** - Migrate from mock.js to `/api/workshops` endpoint

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
