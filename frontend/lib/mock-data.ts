export type Meeting = {
  id: string;
  title: string;
  date: string;
  duration: number; // seconds
  participants: { name: string; email: string; avatar?: string }[];
  status: "completed" | "processing" | "failed";
  summary?: string;
  tags?: string[];
  recordingUrl?: string;
};

export type TranscriptEntry = {
  id: string;
  speakerName: string;
  speakerEmail: string;
  startTime: number; // seconds from start
  endTime: number;
  text: string;
};

export type ActionItem = {
  id: string;
  text: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
  meetingId: string;
};

export type Topic = {
  label: string;
  timestamp: number;
  duration: number;
};

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: "mtg-001",
    title: "Q2 Product Roadmap Planning",
    date: "2024-06-20T10:00:00Z",
    duration: 3720,
    participants: [
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "Rohan Mehta", email: "rohan@company.com" },
      { name: "Priya Kapoor", email: "priya@company.com" },
      { name: "Dev Sharma", email: "dev@company.com" },
    ],
    status: "completed",
    summary:
      "Discussed Q2 product priorities, finalized the AI features roadmap, and aligned on sprint planning for July. Key decisions made around search improvements and dashboard redesign.",
    tags: ["roadmap", "product", "planning"],
  },
  {
    id: "mtg-002",
    title: "Backend Architecture Review",
    date: "2024-06-19T14:30:00Z",
    duration: 2880,
    participants: [
      { name: "Dev Sharma", email: "dev@company.com" },
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "Kiran Bose", email: "kiran@company.com" },
    ],
    status: "completed",
    summary:
      "Reviewed the new microservices architecture proposal. Agreed to migrate auth service first, followed by notifications. Redis caching strategy approved.",
    tags: ["engineering", "architecture", "backend"],
  },
  {
    id: "mtg-003",
    title: "Weekly Standup - June 18",
    date: "2024-06-18T09:00:00Z",
    duration: 900,
    participants: [
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "Rohan Mehta", email: "rohan@company.com" },
      { name: "Priya Kapoor", email: "priya@company.com" },
    ],
    status: "completed",
    tags: ["standup", "weekly"],
  },
  {
    id: "mtg-004",
    title: "Investor Demo Prep Session",
    date: "2024-06-17T11:00:00Z",
    duration: 5400,
    participants: [
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "CEO - Vikram Nair", email: "vikram@company.com" },
      { name: "Priya Kapoor", email: "priya@company.com" },
    ],
    status: "completed",
    summary:
      "Rehearsed the Series A pitch deck. Refined the market size slide and competitive analysis section. Action items around updating revenue projections.",
    tags: ["investor", "fundraising", "demo"],
  },
  {
    id: "mtg-005",
    title: "Design System Sync",
    date: "2024-06-16T15:00:00Z",
    duration: 1800,
    participants: [
      { name: "Priya Kapoor", email: "priya@company.com" },
      { name: "Ananya Singh", email: "ananya@company.com" },
    ],
    status: "completed",
    tags: ["design", "ui"],
  },
  {
    id: "mtg-006",
    title: "Client Onboarding Call - TechCorp",
    date: "2024-06-15T13:00:00Z",
    duration: 2700,
    participants: [
      { name: "Rohan Mehta", email: "rohan@company.com" },
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "Arjun Patel (TechCorp)", email: "arjun@techcorp.com" },
      { name: "Sneha Rao (TechCorp)", email: "sneha@techcorp.com" },
    ],
    status: "completed",
    summary:
      "Walked TechCorp through the platform setup. They need SSO integration and custom branding. Follow-up scheduled for next week.",
    tags: ["client", "onboarding", "sales"],
  },
  {
    id: "mtg-007",
    title: "AI Feature Brainstorm",
    date: "2024-06-25T10:30:00Z",
    duration: 0,
    participants: [
      { name: "Ananya Singh", email: "ananya@company.com" },
      { name: "Dev Sharma", email: "dev@company.com" },
    ],
    status: "processing",
    tags: ["ai", "product"],
  },
];

export const MOCK_TRANSCRIPT: TranscriptEntry[] = [
  {
    id: "t1",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 12,
    endTime: 48,
    text: "Alright, let's get started. Thanks everyone for joining. Today we want to nail down the Q2 roadmap so engineering can start sprint planning by end of week.",
  },
  {
    id: "t2",
    speakerName: "Rohan Mehta",
    speakerEmail: "rohan@company.com",
    startTime: 50,
    endTime: 102,
    text: "Sounds good. I've been looking at the user feedback from last quarter and the top three requests are improved search, better export options, and more granular notification controls.",
  },
  {
    id: "t3",
    speakerName: "Priya Kapoor",
    speakerEmail: "priya@company.com",
    startTime: 105,
    endTime: 165,
    text: "From the design side, I think the search improvement is also tied to the dashboard redesign we've been putting off. If we're going to rebuild search we should probably do it as part of a broader UI refresh. I have some mockups I can share after this.",
  },
  {
    id: "t4",
    speakerName: "Dev Sharma",
    speakerEmail: "dev@company.com",
    startTime: 168,
    endTime: 235,
    text: "That's a good point. Engineering-wise, search is actually a big lift if we want to do it properly with semantic search. We're looking at integrating a vector database, which changes the architecture significantly. I'd estimate at least three sprints.",
  },
  {
    id: "t5",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 238,
    endTime: 290,
    text: "Three sprints means we can't ship it until August. That might be okay actually — we have the investor demo in July and it might be better to demo with something polished rather than half-done search.",
  },
  {
    id: "t6",
    speakerName: "Rohan Mehta",
    speakerEmail: "rohan@company.com",
    startTime: 293,
    endTime: 360,
    text: "Agreed. So for July we focus on the notification controls and the export features — those are faster wins. Search and the dashboard redesign become our August milestone. Does that work for everyone?",
  },
  {
    id: "t7",
    speakerName: "Dev Sharma",
    speakerEmail: "dev@company.com",
    startTime: 363,
    endTime: 420,
    text: "Works for me. I do want to flag that the export feature needs a decision on formats. Right now we support PDF only. Users are asking for CSV, Markdown, and some want Word documents. Each format is a separate implementation.",
  },
  {
    id: "t8",
    speakerName: "Priya Kapoor",
    speakerEmail: "priya@company.com",
    startTime: 422,
    endTime: 478,
    text: "From UX research, CSV and PDF cover about 85% of use cases. I'd say ship those two, add Markdown as a stretch goal, and deprioritize Word for now.",
  },
  {
    id: "t9",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 480,
    endTime: 540,
    text: "Perfect. Let's lock that in. CSV and PDF for export in July, Markdown is nice-to-have. Rohan, can you update the PRD today with these decisions and share it in Slack?",
  },
  {
    id: "t10",
    speakerName: "Rohan Mehta",
    speakerEmail: "rohan@company.com",
    startTime: 542,
    endTime: 580,
    text: "Will do, I'll have it done by EOD. Should I loop in the design team on the dashboard redesign scope as well?",
  },
  {
    id: "t11",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 582,
    endTime: 630,
    text: "Yes, please. Priya — can you schedule a design sync with Dev's team for next week? We need to align on the component library before anyone starts building.",
  },
  {
    id: "t12",
    speakerName: "Priya Kapoor",
    speakerEmail: "priya@company.com",
    startTime: 632,
    endTime: 685,
    text: "Sure, I'll send a calendar invite by tomorrow morning. I'm also thinking we should document the design tokens formally so we don't end up with another inconsistency problem like last quarter.",
  },
  {
    id: "t13",
    speakerName: "Dev Sharma",
    speakerEmail: "dev@company.com",
    startTime: 688,
    endTime: 750,
    text: "Fully agree. The inconsistency issue cost us like two extra sprints in Q1 because frontend kept having to rework components. A proper design system document upfront would save us a lot.",
  },
  {
    id: "t14",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 752,
    endTime: 810,
    text: "Great. Let's also set up a quick checkpoint mid-July to make sure we're on track. I'll put something on the calendar. Any other blockers or risks anyone wants to raise before we wrap up?",
  },
  {
    id: "t15",
    speakerName: "Rohan Mehta",
    speakerEmail: "rohan@company.com",
    startTime: 812,
    endTime: 870,
    text: "One thing — we're waiting on API credentials from our payment provider to test the billing changes. I've sent two follow-up emails. If we don't hear back by Friday I'll escalate through their account manager.",
  },
  {
    id: "t16",
    speakerName: "Ananya Singh",
    speakerEmail: "ananya@company.com",
    startTime: 872,
    endTime: 920,
    text: "Good call, don't wait too long on that. Okay, I think we've covered everything. Thanks all — this was productive. Have a good rest of your day.",
  },
];

export const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    id: "ai-001",
    text: "Update the PRD with roadmap decisions and share in Slack",
    assignee: "Rohan Mehta",
    dueDate: "2024-06-20",
    completed: true,
    meetingId: "mtg-001",
  },
  {
    id: "ai-002",
    text: "Schedule design sync with engineering team for next week",
    assignee: "Priya Kapoor",
    dueDate: "2024-06-21",
    completed: false,
    meetingId: "mtg-001",
  },
  {
    id: "ai-003",
    text: "Document design tokens formally before sprint begins",
    assignee: "Priya Kapoor",
    dueDate: "2024-06-28",
    completed: false,
    meetingId: "mtg-001",
  },
  {
    id: "ai-004",
    text: "Set up mid-July checkpoint meeting",
    assignee: "Ananya Singh",
    dueDate: "2024-06-22",
    completed: true,
    meetingId: "mtg-001",
  },
  {
    id: "ai-005",
    text: "Escalate API credentials issue with payment provider account manager",
    assignee: "Rohan Mehta",
    dueDate: "2024-06-21",
    completed: false,
    meetingId: "mtg-001",
  },
];

export const MOCK_TOPICS: Topic[] = [
  { label: "Q2 Priorities Overview", timestamp: 12, duration: 180 },
  { label: "Search Feature Discussion", timestamp: 168, duration: 240 },
  { label: "Export Feature Formats", timestamp: 363, duration: 180 },
  { label: "Dashboard Redesign Scope", timestamp: 480, duration: 200 },
  { label: "Design System & Tokens", timestamp: 632, duration: 180 },
  { label: "Mid-July Checkpoint", timestamp: 752, duration: 120 },
  { label: "Payment Provider Blocker", timestamp: 812, duration: 108 },
];