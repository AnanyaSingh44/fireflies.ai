"use client";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  Clock,
  Users,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Meeting } from "@/lib/mock-data";

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

const STATUS_COLORS = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-pink-400",
];

function avatarColor(email: string) {
  const idx = email.charCodeAt(0) % STATUS_COLORS.length;
  return STATUS_COLORS[idx];
}

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const dateLabel = format(parseISO(meeting.date), "MMM dd, yyyy · h:mm a");

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="group bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl px-5 py-4 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[1.5vh] font-semibold text-foreground dark:text-zinc-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                {meeting.title}
              </h3>

              {meeting.status === "processing" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  Processing
                </span>
              )}

              {meeting.status === "failed" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/20 px-2 py-0.5 rounded-full shrink-0">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Failed
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-md text-muted-foreground dark:text-zinc-400 mb-2">
              <span>{dateLabel}</span>

              {meeting.status === "completed" && meeting.duration > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {fmtDuration(meeting.duration)}
                  </span>
                </>
              )}

              <span>·</span>

              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {meeting.participants.length}
              </span>
            </div>

            {/* Summary */}
            {meeting.summary && (
              <p className="text-l text-muted-foreground dark:text-zinc-400 line-clamp-2 mb-2">
                {meeting.summary}
              </p>
            )}

            {/* Tags */}
            {meeting.tags && meeting.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3 h-3 text-muted-foreground/70 dark:text-zinc-500" />

                {meeting.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-md font-medium text-muted-foreground dark:text-zinc-300 bg-muted dark:bg-zinc-800 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Avatars */}
          <div className="flex items-center shrink-0">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 4).map((p, i) => (
                <div
                  key={p.email}
                  title={p.name}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold border-2 border-background dark:border-zinc-900",
                    avatarColor(p.email)
                  )}
                  style={{ zIndex: 10 - i }}
                >
                  {initials(p.name)}
                </div>
              ))}

              {meeting.participants.length > 4 && (
                <div
                  className="w-7 h-7 rounded-full bg-muted dark:bg-zinc-800 flex items-center justify-center text-muted-foreground dark:text-zinc-300 text-[9px] font-bold border-2 border-background dark:border-zinc-900"
                  style={{ zIndex: 6 }}
                >
                  +{meeting.participants.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}