# LeadDesk Mini

LeadDesk Mini is a full-stack lead-capture tool for an agency, built with Next.js, Tailwind CSS, and Supabase. It features a stunning dark-themed landing page and a secure admin dashboard to manage incoming leads.

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- Supabase (Postgres + Auth)
- Framer Motion

## Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository_url>
   cd leaddesk-mini
   npm install
   ```

2. **Supabase Configuration**
   - Create a new project on [Supabase](https://supabase.com).
   - Go to Project Settings -> API to find your URL and Anon Key.
   - Copy `.env.example` to `.env.local` and add your keys:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Run the SQL migration in `supabase/migrations/00000_create_leads_table.sql` in the Supabase SQL Editor.
   - Set up Supabase Auth: Enable Email Auth (and disable email confirmation for local testing if desired). Create a user to access the admin dashboard.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see the landing page, and `http://localhost:3000/admin` to log in as an administrator.

## API Contracts

### `POST /api/leads`
Creates a new lead from the landing page.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "budget_range": "$5k-20k",
    "message": "Project details here"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "data": { ...leadObject }
  }
  ```

### `GET /api/leads`
Fetches all leads (requires authenticated Supabase session).
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": [ { ...leadObject }, ... ]
  }
  ```

### `PATCH /api/leads/:id`
Updates the status of a specific lead (requires authenticated Supabase session).
- **Request Body**:
  ```json
  {
    "status": "Contacted" // or "New", "Closed"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": { ...updatedLeadObject }
  }
  ```

## Architecture Decisions

1. **Supabase over Custom Auth**
   We chose Supabase Auth to handle secure authentication without needing to maintain custom JWT implementations, secure cookie parsing, and password hashing. Supabase integrates seamlessly into Next.js through the `@supabase/ssr` package and gives us out-of-the-box Row Level Security (RLS) to enforce data protection at the database level.

2. **Server-Side Validation Duplicating Client-Side**
   We explicitly validate incoming payloads in `/api/leads` (e.g. required fields, valid budget enums, email formats) even though the client form uses native and custom validation. This is a critical security practice because client-side validation can easily be bypassed via curl or direct API hits. We never trust client input.

3. **Middleware for Auth Guards over Per-Page Checks**
   Next.js Edge Middleware intercepts requests before they hit the server or client rendering phase. By protecting the `/admin` route prefix at the middleware level, we guarantee that no unauthenticated user can even load the JS bundles for the admin pages, providing a robust security layer and reducing boilerplate per page.

---
*Built for Digital Heroes Training Task*
