"use client";

import { Loader2 } from "lucide-react";
import { useTopics } from "@/hooks/use-api";

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TOPIC_COLORS = [
  "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
];

export function TopicsPanel({ meetingId }: { meetingId: string }) {
  const { data: topics, isLoading } = useTopics(meetingId);

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-purple-400 dark:text-purple-300" />
      </div>
    );

  if (!topics || topics.length === 0)
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
        No topics detected
      </p>
    );

  const totalDuration =
    topics[topics.length - 1].timestamp +
    topics[topics.length - 1].duration;

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        {topics.map((topic, i) => {
          const left = (topic.timestamp / totalDuration) * 100;
          const width = (topic.duration / totalDuration) * 100;
          const colorClass = TOPIC_COLORS[i % TOPIC_COLORS.length];

          return (
            <div
              key={i}
              title={topic.label}
              className={`absolute top-0 h-full rounded-sm ${colorClass.split(" ")[0]}`}
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 1)}%`,
              }}
            />
          );
        })}
      </div>

      {/* Topics */}
      <div className="space-y-2">
        {topics.map((topic, i) => {
          const colorClass = TOPIC_COLORS[i % TOPIC_COLORS.length];

          return (
            <div
              key={i}
              className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${colorClass.split(" ")[0]}`}
                />
                <span className="text-md font-medium truncate">
                  {topic.label}
                </span>
              </div>

              <span className="text-md font-medium opacity-70 shrink-0 ml-2">
                {fmtTime(topic.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}