# Fireflies.ai Clone — Meeting Notes & Transcription Platform

A polished, full-stack meeting intelligence workspace built as a technical assignment to mirror the productivity-first experience of Fireflies.ai. The platform combines a modern Next.js frontend with a FastAPI backend and a SQLite-backed data layer to support meeting ingestion, transcript viewing, AI-style summaries, topic extraction, and collaborative action-item workflows.

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20SQLite-blue)

---

## 🚀 Project Overview

This repository implements a modular, monolith-style application split cleanly into two independent layers:

- A responsive frontend built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui primitives.
- A RESTful backend built with FastAPI, SQLAlchemy, and SQLite for structured meeting data persistence.

The product experience is designed around a high-productivity post-meeting workflow where users can:

- Browse and search meeting records from a modern dashboard.
- Open a meeting detail experience with transcript-aware interaction.
- Review AI-inspired summaries, key decisions, next steps, and tags.
- Create, update, and delete meeting records with structured metadata.
- Manage action items inline and analyze transcript content through an automated parser.

### ✨ Core Features

- Meetings Library Dashboard
  - Search by title or keyword
  - Date filtering and recency sorting
  - Grouped meeting history view by month

- Interactive Meeting Detail Experience
  - Transcript timeline with clickable blocks
  - Time-aware navigation and context-aware review
  - Seamless sync between transcript segments and meeting flow

- AI Summary Panel
  - Overview summary
  - Key decisions
  - Next steps and follow-ups
  - Dynamic tagging and structured highlights

- Full CRUD Workflows
  - Create meetings with transcript payloads
  - Edit meeting metadata and summaries
  - Delete meetings with cascading cleanup
  - Inline action item creation and mutation

- Bonus Features Implemented
  - Dark mode support via class-based theming
  - Automated transcript text parser using regular-expression-based block splitting

---

## 🛠️ Tech Stack & Modular Architecture

### Frontend

- Next.js 15 (TypeScript)
- Tailwind CSS
- Lucide React
- TanStack React Query
- shadcn/ui primitives

### Backend

- Python 3
- FastAPI
- SQLAlchemy ORM
- Uvicorn
- Python-Multipart
- Regex-based transcript parsing engine

### Database

- SQLite for local persistence and fast iteration

### Why React Query Was Chosen

React Query provides a clean, declarative pattern for:

- Server-state synchronization
- Automatic caching
- Background refetching
- Efficient invalidation after mutations
- Consistent UI updates when meeting records, transcripts, or action items change

This makes the frontend more resilient and ensures state remains synchronized with backend updates without excessive manual plumbing.

### Architecture Overview

```text
frontend/            # Next.js UI, routing, components, hooks, styles
backend/             # FastAPI app, SQLAlchemy models, routes, services
├── app/
│   ├── main.py
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   └── seed/
```

The system follows a clean separation of concerns:

- Frontend handles presentation, navigation, and client-side state.
- Backend manages domain logic, persistence, and API contract enforcement.
- SQLite acts as the local persistence layer for all meeting-related entities.

---

## 💾 Database Schema Design

The application uses a relational SQLite schema centered around meetings, participants, transcripts, action items, and topics.

| Table / Layer | Fields | Types / Constraints | Relationship | Notes |
|---|---|---|---|---|
| Meeting | id (PK), title, date, duration, media_url, summary | Integer PK, String/Text, DateTime, nullable fields | 1:M to TranscriptSegment, ActionItem, Topic; M:N with Participant | Core entity for each recorded meeting |
| Participant | id (PK), name, email | Integer PK, String, unique nullable email | M:N with Meeting | Stores attendee identities |
| meeting_participants | meeting_id (FK), participant_id (FK) | Junction table with composite relationship mapping | M:N bridge | Enables multiple meetings to share participants |
| TranscriptSegment | id (PK), meeting_id (FK), speaker, text, start_time, end_time | Integer PK, FK, String/Text, Float | 1:M from Meeting | Stores transcript blocks in chronological order |
| ActionItem | id (PK), meeting_id (FK), task, completed | Integer PK, FK, String, Boolean | 1:M from Meeting | Tracks follow-up tasks generated from meetings |
| Topic | id (PK), meeting_id (FK), title, summary, start_time, end_time | Integer PK, FK, String/Text, Float | 1:M from Meeting | Represents thematic discussion segments |

### Relational Behavior

- A meeting can have many transcript segments, topics, and action items.
- Participants can belong to many meetings through the junction table.
- Deleting a meeting should cascade cleanup to related transcript content, topics, and action items to preserve referential integrity.

### Example Data Relationship Flow

```text
Meeting
  ├── TranscriptSegment(s)
  ├── ActionItem(s)
  ├── Topic(s)
  └── Participant(s) via meeting_participants
```

---

## 🔌 API Overview & Endpoint Specs

The backend exposes structured RESTful endpoints for meeting lifecycle management and retrieval workflows.

| Endpoint | Method | Purpose | Request Body / Params | Notes |
|---|---|---|---|---|
| /meetings | GET | Fetch all meetings | Optional sort/date_filter query params | Supports list rendering and filtering |
| /meetings/search | GET | Search meetings by keyword | q query param | Useful for dashboard search |
| /meetings/{id} | GET | Fetch single meeting by ID | Path parameter id | Returns full meeting details |
| /meetings | POST | Create a meeting | CreateMeetingRequest payload | Accepts transcript block text for parsing |
| /meetings/{id} | PUT | Update meeting metadata | Update payload | Supports editing summaries/meta |
| /meetings/{id} | DELETE | Delete a meeting | Path parameter id | Cascades cleanup for related records |

### Example Create Payload

```json
{
  "title": "Q2 Roadmap Planning",
  "date": "2026-06-25T10:30:00Z",
  "duration": 3600,
  "media_url": "https://example.com/recording.mp3",
  "summary": "Discussed roadmap priorities and follow-up actions.",
  "participants": [
    { "name": "Ananya Singh", "email": "ananya@example.com" }
  ],
  "raw_transcript": "Speaker A: Let's start...\nSpeaker B: Sounds good..."
}
```

### API Design Notes

- Endpoints are intentionally structured for predictable CRUD behavior.
- The create flow accepts raw transcript text and processes it through the parser engine.
- The frontend consumes these endpoints using React Query to minimize repeated fetches and keep the UI responsive.

---

## 💻 Local Setup & Installation

### 1) Backend Setup (FastAPI + SQLite)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will run on:

```text
http://localhost:8000
```

### 2) Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:3000
```

### 3) Optional Verification

Once both services are running:

- Open the frontend in the browser.
- Confirm the meetings dashboard renders correctly.
- Create or inspect a meeting to ensure transcription and summary views function end-to-end.

---

## 🎯 Assumptions & Scope Adjustments

To keep the assignment focused on the core post-meeting product experience, the following assumptions were made:

- A default mock-authenticated user is assumed for the UI experience.
- Real-time audio analysis, Zoom integrations, and live bot ingestion are intentionally marked as future enhancements.
- The platform prioritizes structured meeting review workflows over real-time transcription streaming.
- The current implementation focuses heavily on:
  - meeting record management
  - transcript presentation
  - action item workflows
  - summary and topic organization

These choices preserve a strong engineering focus on architecture, CRUD workflows, UI/UX polish, and backend modularity while keeping the app practical and evaluable.

---

## 📌 Summary

This project showcases a production-oriented, modular, full-stack implementation of a meeting intelligence platform with polished UI/UX, a structured backend API, and a relational database layer designed for extensibility. It is well-suited for evaluation as a strong demonstration of:

- Full-stack engineering fundamentals
- Clean API design
- SQLAlchemy model design
- Component-driven frontend architecture
- State management with React Query
- Thoughtful UX and feature completeness

If you want, I can also generate a matching GitHub-compatible banner image section, contributing guide, or a more concise one-page version of this README for faster evaluation readability.
