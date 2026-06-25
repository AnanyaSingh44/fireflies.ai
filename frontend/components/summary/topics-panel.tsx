"use client";
import { Loader2 } from "lucide-react";
import { useTopics } from "@/hooks/use-api";

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TOPIC_COLORS = [
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-green-100 text-green-700 border-green-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
];

export function TopicsPanel({ meetingId }: { meetingId: string }) {
  const { data: topics, isLoading } = useTopics(meetingId);

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
      </div>
    );

  if (!topics || topics.length === 0)
    return <p className="text-xs text-gray-400 text-center py-4">No topics detected</p>;

  // Build a simple timeline visualization
  const totalDuration = topics[topics.length - 1].timestamp + topics[topics.length - 1].duration;

  return (
    <div className="space-y-4">
      {/* Timeline bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        {topics.map((topic, i) => {
          const left = (topic.timestamp / totalDuration) * 100;
          const width = (topic.duration / totalDuration) * 100;
          const colorClass = TOPIC_COLORS[i % TOPIC_COLORS.length];
          return (
            <div
              key={i}
              title={topic.label}
              className={`absolute top-0 h-full rounded-sm ${colorClass.split(" ")[0]}`}
              style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
            />
          );
        })}
      </div>

      {/* Topic list */}
      <div className="space-y-2">
        {topics.map((topic, i) => {
          const colorClass = TOPIC_COLORS[i % TOPIC_COLORS.length];
          return (
            <div
              key={i}
              className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${colorClass.split(" ")[0]}`} />
                <span className="text-xs font-medium truncate">{topic.label}</span>
              </div>
              <span className="text-[10px] font-medium opacity-70 shrink-0 ml-2">
                {fmtTime(topic.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}