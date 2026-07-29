# PlacementPrep

PlacementPrep is a peer interview preparation platform that helps users create interview practice slots, connect with other participants, manage requests, submit feedback, and track profile reputation.

## Overview

- **Client:** React + Vite modern web app
- **Server:** Node.js + Express + MongoDB + Mongoose
- **Authentication:** Google social login via Better Auth
- **Notifications:** in-app notification panel for connection requests, bookings, declines, cancellations
- **Feedback workflow:** participants must submit feedback after completed sessions before creating or requesting new slots

## Key Features

- Google-based authentication and session management
- Public list of available interview slots
- Create new practice slots with title, capacity, start time, duration, and meeting link
- Send connection requests with message and resume/LinkedIn URL
- Accept or decline interested requests as slot owner
- Cancel booked sessions and open capacity if needed
- Profile pages with bio, skills, experience level, target role, resume links, and feedback history
- Pending feedback enforcement to keep members accountable
- Real-time notifications for slot actions and booking events

## User Flow

### 1. Login

- The app opens at the landing page when not signed in
- Users sign in with Google via Better Auth
- After successful login, the client calls `/api/users/sync` to ensure the user exists in MongoDB

### 2. Dashboard

- After login, users land on the main Dashboard
- Default view is **Available Slots** with all open sessions
- Each slot card shows:
  - title
  - slot owner
  - start date/time
  - duration
  - booked count / capacity
  - status (`Open`, `Full` or `Your slot`)
- Available slots can be filtered by the UI tab

### 3. Create a slot

- Click **Create Slot** from the dashboard
- Fill in:
  - title
  - capacity
  - start time
  - duration
  - meeting link
- The slot is created as the authenticated user and shown immediately in the available list
- The backend validates required fields and ensures start time is in the future

### 4. Request to connect

- On an available slot card, click **Connect**
- Submit a short message and resume/LinkedIn URL
- This creates a request with status `interested`
- The slot owner receives a notification and can review the request

### 5. Manage my slots

Under the **My Slots** tab, users can switch between:

- **Posted** slots they created
- **Requested** slots they asked to join

#### Posted

- Shows your open slots and incoming requests
- You can accept or decline interested requests
- When a request is accepted, the status becomes `booked`
- If capacity is reached, the slot becomes `full`
- You may cancel a slot if needed, notifying all requesters

#### Requested

- Shows slots you have requested or booked
- If booked, the slot card displays a join link once the meeting start time arrives
- Users can cancel their own booked requests

### 6. Feedback requirement

- After a session is complete, the app checks for pending feedback
- If any feedback is missing, the user is blocked from creating slots or sending new requests until feedback is submitted
- The Dashboard displays a feedback modal when required

### 7. Profile and reviews

- The navbar includes a **My Profile** button
- Viewing your own profile opens an editable profile form
- Other user profiles show:
  - bio
  - skills
  - experience level
  - target role
  - links
  - average ratings
  - comments from past sessions
- Your profile can be updated with new bio, skills, experience level, target role, and links

### 8. Notifications

- Notifications appear in the bell menu
- The unread counter updates automatically
- Clicking the bell marks notifications as read
- Notification types include:
  - connection request received
  - request sent
  - booking confirmed
  - request declined
  - booking canceled
  - slot canceled or rescheduled

## Architecture

### Client

- `client/src/App.jsx`: handles auth state and routes users to landing or dashboard
- `client/src/pages/Dashboard.jsx`: main app shell with tabs and profile navigation
- `client/src/components/slots/SlotGrid.jsx`: displays available slots and create slot dialog
- `client/src/components/layout/Form.jsx`: slot creation form
- `client/src/components/slots/SlotCard.jsx`: individual available slot card
- `client/src/components/slots/ConnectForm.jsx`: request form for connecting to a slot
- `client/src/pages/ProfilePage.jsx`: profile view / edit UI
- `client/src/hooks/`: reusable hooks for auth, slots, notifications, pending feedback, profile data
- `client/src/services/`: fetch wrappers for API endpoints

### Server

- `server/server.js`: Express app, CORS, auth, route setup
- `server/auth.js`: Better Auth configuration with Google auth provider
- `server/models/`: Mongoose models for `User`, `Slot`, `Feedback`, `Notification`
- `server/controllers/`: request handlers for slots, notifications, feedback, profiles, auth user sync
- `server/middleware/`: `requireAuth`, rate limits, and pending feedback checks
- `server/utils/`: helpers for feedback calculations, notifications, slot time utilities

## API Endpoints

### Authentication

- `POST /api/auth/*path` — Better Auth handlers
- `POST /api/users/sync` — create or sync the current user after auth
- `GET /api/users/me` — get the current user record

### Slots

- `GET /api/slots` — list active open slots
- `POST /api/slots` — create a new slot
- `GET /api/slots/mine/posted` — fetch slots posted by the user
- `GET /api/slots/mine/requested` — fetch requested/booked slots for the user
- `POST /api/slots/:id/connect` — request to join a slot
- `PATCH /api/slots/:id/requests/:userId/accept` — accept a pending request
- `DELETE /api/slots/:id/requests/:userId` — decline or cancel a request
- `PUT /api/slots/:id` — reschedule a slot (if implemented)
- `DELETE /api/slots/:id` — cancel a slot

### Feedback

- `GET /api/feedback/pending` — fetch feedback tasks awaiting submission
- `POST /api/feedback` — submit session feedback
- `GET /api/feedback/user/:userId` — fetch reviews for a profile

### Profile

- `GET /api/users/:id/profile` — fetch full profile + feedback summary
- `PUT /api/users/me/profile` — update current user profile

### Notifications

- `GET /api/notifications` — list notifications
- `PATCH /api/notifications/read-all` — mark notifications read
- `PATCH /api/notifications/:id/read` — mark single notification read

## Running Locally

### Prerequisites

- Node.js 18+ (or compatible modern Node)
- MongoDB instance
- Google OAuth credentials

### Environment variables

Create a `.env` file in `server/` with:

```env
ATLASDB_URL=<your-mongodb-connection-string>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
BETTER_AUTH_URL=http://localhost:5173
```

### Install dependencies

```powershell
cd server
npm install
cd ../client
npm install
```

### Start the server

```powershell
cd server
npm run dev
```

### Start the client

```powershell
cd client
npm run dev
```

- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:8080`

## Development Notes

- `client/src/config.js` points `API_BASE` to `http://localhost:8080` during development.
- The server serves the production client build from `client/dist` when deployed.
- `server/middleware/blockIfPendingFeedback.js` blocks slot creation and connection if a user still has unresolved feedback tasks.
- `server/controllers/respondToRequest.js` supports both poster declines and participant cancellations.

## Folder Structure

- `client/` — frontend app source and build scripts
  - `src/components` — UI components
  - `src/hooks` — shared client hooks
  - `src/services` — API calls
  - `src/pages` — page-level views
- `server/` — backend app source
  - `models/` — MongoDB models
  - `controllers/` — route handlers
  - `middleware/` — auth and rate limiting logic
  - `utils/` — helper modules

## Tips

- Ensure the Google OAuth redirect origin matches `http://localhost:5173`
- If a slot is already full, new requests cannot be accepted
- Users can always cancel their own booked slot requests
- The app enforces feedback before allowing new interactions, so finish feedback promptly

## Future Improvements

- Add pagination/filtering for slots
- Add search by skills or topic
- Add user role and experience filters
- Add email notifications for important events
- Add more robust session history and analytics

---

PlacementPrep brings interview practice scheduling, booking, and feedback into a lightweight peer-driven workflow. Use the dashboard to create slots, connect, manage requests, and keep your profile up to date.
