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
6. **Event Calendar** - Upcoming events with registration
7. **Membership** - Application forms for individuals, churches, organizations
8. **Contact** - Contact form and info
9. **Members Area** - Protected area with additional resources
10. **Donations** - Support page with Swish and bank transfer options ✅ NEW
11. **Admin Panels** - Manage all dynamic content

### Admin Panels
- Leaders/Facilitators management
- Board of Directors (current/archived)
- Form submissions (applications, contact)
- Organization/Church members
- Partners
- Testimonials

### Technical Stack
- **Frontend:** React, React Router, TailwindCSS, Shadcn/UI
- **Backend:** FastAPI, Pydantic
- **Database:** MongoDB
- **Internationalization:** Custom context-based (SV/EN/AR with RTL)

---

## What's Been Implemented

### January 2026

#### Donations Page ✅ (Latest)
- Created `/donera` route with full UI
- Swish payment with test number display
- Bank transfer details (Swedbank, IBAN, BIC/SWIFT)
- One-time gift ("Engångsgåva") options: 100, 250, 500, 1000 kr
- Recurring gift ("Regelbunden gåva") options: 100, 250, 500 kr/month
- Impact section explaining donation purpose
- Copy-to-clipboard functionality for payment details
- Full i18n support (Swedish, English, Arabic)
- Added "Ge en Gåva" link to main navigation

#### Previous Work (From Handoff)
- Board Member Management (CRUD, active/archived)
- Partner & Organization Management
- Testimonial Management with admin panel
- Approve/Reject Application functionality
- Event Calendar with Leader Experience programs
- Dual Password System (site + members area)
- Environment variable configuration for passwords
- Core Subjects modal in Members Area
- UI/Layout adjustments throughout

---

## Credentials
- **Website Password:** Stored in backend `.env` as `SITE_PASSWORD`
- **Members Area Password:** Stored in backend `.env` as `MEMBERS_PASSWORD`
- **Test values:** `Keeada2030` (site), `Haggai2030!` (members)

---

## Prioritized Backlog

### P0 (Critical) - None currently

### P1 (High Priority)
- Update Swish/bank details when user provides real numbers
- QR code integration for Swish (currently placeholder)

### P2 (Medium Priority)
- Email notifications for form submissions
- Migrate Leader Experience programs from mock.js to database
- Add Admin panel for Leader Experience programs

### P3 (Low Priority/Future)
- Online payment integration (Stripe/PayPal)
- User accounts and login
- Newsletter subscription system

---

## Key Files Reference
- `/app/frontend/src/pages/Donations.jsx` - Donations page
- `/app/frontend/src/components/layout/Header.jsx` - Navigation
- `/app/frontend/src/App.js` - Routing
- `/app/backend/server.py` - All API endpoints
- `/app/frontend/src/data/translations.js` - i18n strings
- `/app/frontend/src/data/mock.js` - Mock data for programs

---

## API Endpoints
- `GET/POST/PUT/DELETE /api/leaders`
- `GET/POST/PUT/DELETE /api/board-members`
- `GET/POST/PUT/DELETE /api/organization-members`
- `GET/POST/PUT/DELETE /api/partners`
- `GET/POST/PUT/DELETE /api/testimonials`
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
- `leader_experience_applications`
- `membership_applications`
- `contact_submissions`

---

## Known Mocked Data
- Leader Experience programs are loaded from `/app/frontend/src/data/mock.js` (not database)
