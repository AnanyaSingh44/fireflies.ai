"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Loader2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranscriptSearch } from "@/hooks/use-api";
import { type TranscriptEntry } from "@/lib/mock-data";

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const SPEAKER_COLORS = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-teal-400",
];

function speakerColor(name: string) {
  const idx = name.charCodeAt(0) % SPEAKER_COLORS.length;
  return SPEAKER_COLORS[idx];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-white rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function TranscriptPanel({
  meetingId,
}: {
  meetingId: string;
}) {
  const [query, setQuery] = useState("");

  const { data: entries = [], isLoading } = useTranscriptSearch(
    meetingId,
    query
  );

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const lineRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

  const totalDuration =
    entries.length > 0
      ? entries[entries.length - 1].endTime
      : 0;

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;

        if (next >= totalDuration) {
          setPlaying(false);
          return totalDuration;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [playing, totalDuration]);

  const activeId = useMemo(() => {
    const active = entries.find(
      (e) =>
        currentTime >= e.startTime &&
        currentTime < e.endTime
    );

    return active?.id;
  }, [entries, currentTime]);

  useEffect(() => {
    if (!activeId) return;

    lineRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeId]);

  const grouped: {
    speaker: string;
    entries: TranscriptEntry[];
  }[] = [];

  entries.forEach((entry) => {
    const last = grouped[grouped.length - 1];

    if (last && last.speaker === entry.speakerName) {
      last.entries.push(entry);
    } else {
      grouped.push({
        speaker: entry.speakerName,
        entries: [entry],
      });
    }
  });

  return (
    <div className="ml-[1vh] flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Search */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-zinc-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript..."
            className="w-full pl-9 pr-3 h-8 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        {/* Virtual Player */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition"
          >
            {playing ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
            {fmtTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={currentTime}
            onChange={(e) =>
              setCurrentTime(Number(e.target.value))
            }
            className="flex-1 accent-purple-600"
          />

          <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
            {fmtTime(totalDuration)}
          </span>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400" />
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            {query
              ? `No results for "${query}"`
              : "No transcript available"}
          </p>
        ) : (
          grouped.map((group, gi) => (
            <div
              key={gi}
              className="flex gap-3"
            >
              <div className="shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center",
                    speakerColor(group.speaker)
                  )}
                >
                  {initials(group.speaker)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                    {group.speaker}
                  </span>

                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {fmtTime(group.entries[0].startTime)}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.entries.map((entry) => {
                    const active = activeId === entry.id;

                    return (
                      <p
                        key={entry.id}
                        ref={(el) => {
                          lineRefs.current[entry.id] = el;
                        }}
                        onClick={() =>
                          setCurrentTime(entry.startTime)
                        }
                        className={cn(
                          "text-sm leading-relaxed rounded-lg px-2 py-1 cursor-pointer transition-all duration-300",
                          active
                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-200 shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        {highlight(entry.text, query)}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}