"use client";
import { use, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Meeting } from "@/lib/types";
import {
  ArrowLeft,
  Clock,
  Users,
  Share2,
  Download,
  MoreHorizontal,
  Loader2,
  Bot,
  FileText,
  CheckSquare,
  Tag,
  ChevronRight,
  Copy,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header/index";
import { TranscriptPanel } from "@/components/transcript";
import { ActionItemsPanel } from "@/components/action-items-panel/index";
import { TopicsPanel } from "@/components/topics-panel/index";
import { useMeeting } from "@/hooks/use-api";

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-purple-500", "bg-blue-500", "bg-green-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
];

type RightTab = "summary" | "action-items" | "topics";

const RIGHT_TABS: { id: RightTab; label: string; icon: React.ElementType }[] = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "action-items", label: "Action Items", icon: CheckSquare },
  { id: "topics", label: "Topics", icon: Tag },
];

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    data: meeting,
    isLoading,
    error,
  } = useMeeting(id) as {
    data: Meeting | undefined;
    isLoading: boolean;
    error: Error | null;
  };  
  
  const [rightTab, setRightTab] = useState<RightTab>("summary");

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Sidebar />
        <div className="ml-[200px] flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Sidebar />
        <div className="ml-[200px] flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-gray-500 dark:text-zinc-400 text-sm">Meeting not found</p>
          <Link href="/meetings" className="text-purple-600 dark:text-purple-400 text-sm hover:underline">
            Back to Meetings
          </Link>
        </div>
      </div>
    );
  }

  const dateLabel = format(parseISO(meeting.date), "MMM dd, yyyy · h:mm a");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Sidebar />

      <div className="ml-[30vh] flex-1 flex flex-col min-h-screen">
        {/* Top header with breadcrumb */}
        <Header title="Meetings" />

        {/* Meeting header bar */}
        <div className="bg-white border-b border-gray-100 dark:bg-zinc-900/50 dark:border-zinc-800 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 mb-2">
                <Link href="/meetings" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Meetings
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 dark:text-zinc-300 truncate max-w-[300px]">{meeting.title}</span>
              </div>

              <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">{meeting.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
                <span>{dateLabel}</span>
                {meeting.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                    {fmtDuration(meeting.duration)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                  {meeting.participants.length} participants
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 dark:text-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                <Star className="w-3.5 h-3.5" />
                Save
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 dark:text-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 dark:text-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Participants row */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {meeting.participants.map((p, i) => (
                  <div
                    key={p.email}
                    title={p.name}
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-white dark:border-zinc-900/50",
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    )}
                    style={{ zIndex: 20 - i }}
                  >
                    {initials(p.name)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-zinc-400 ml-1">
                {meeting.participants.map((p) => p.name.split(" ")[0]).join(", ")}
              </span>
            </div>

            {/* AskFred button */}
            <div className="ml-auto">
              <button className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors">
                <Bot className="w-3.5 h-3.5" />
                Ask Fred
              </button>
            </div>
          </div>
        </div>

        {/* Main two-column body */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Transcript */}
          <div className="flex-1 border-r border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/20 overflow-y-auto flex flex-col">
            <div className="px-5 py-3 border-b border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Transcript</span>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 ml-auto hover:text-gray-700 dark:hover:text-zinc-200 transition-colors">
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>

            <TranscriptPanel meetingId={id} />        
          </div>

          {/* RIGHT: Summary / Action Items / Topics */}
          <div className="w-[380px] shrink-0 bg-white dark:bg-zinc-900/30 flex flex-col overflow-hidden">
            {/* Tab nav */}
            <div className="flex border-b border-gray-100 dark:border-zinc-800 px-1 bg-white dark:bg-zinc-900/40">
              {RIGHT_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors",
                      rightTab === tab.id
                        ? "border-purple-600 text-purple-700 dark:border-purple-500 dark:text-purple-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {rightTab === "summary" && (
                <div className="px-5 py-5 space-y-5">
                  {/* Overview */}
                  <section>
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                      Overview
                    </h3>
                    {meeting.summary ? (
                      <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{meeting.summary}</p>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-zinc-500 italic">
                        Summary will appear here after the meeting is processed.
                      </p>
                    )}
                  </section>

                  {/* Key decisions */}
                  <section>
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                      Key Decisions
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Notification controls and export features scheduled for July sprint",
                        "Search improvement and dashboard redesign moved to August",
                        "Export formats: CSV and PDF for July; Markdown as stretch goal",
                        "Design system documentation required before sprint begins",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Next steps */}
                  <section>
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                      Next Steps
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Rohan to update PRD and share in Slack by EOD",
                        "Priya to schedule design sync with engineering team",
                        "Mid-July checkpoint meeting to be added to calendar",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Tags */}
                  {meeting.tags && meeting.tags.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {meeting.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-600 bg-gray-100 dark:text-zinc-300 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {rightTab === "action-items" && (
                <div className="px-5 py-5">
                  <ActionItemsPanel meetingId={id} />
                </div>
              )}

              {rightTab === "topics" && (
                <div className="px-5 py-5">
                  <TopicsPanel meetingId={id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}