"use client";

import { Search, Mic, Bell, ChevronDown, Video } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  onSearch?: (q: string) => void;
}

export function Header({ title = "Home", onSearch }: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="h-14 bg-background dark:bg-zinc-950/95 border-b border-border dark:border-zinc-800 flex items-center px-6 gap-4 sticky top-0 z-30">
      <span className="text-sm font-medium text-foreground dark:text-zinc-100 w-28">
        {title}
      </span>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />

        <input
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Search by title or keyword"
          className="w-full pl-9 pr-3 h-8 text-sm bg-muted dark:bg-zinc-900 border border-border dark:border-zinc-700 rounded-lg text-foreground dark:text-zinc-100 placeholder:text-muted-foreground dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground dark:text-zinc-500 font-medium">
          Ctrl + K
        </span>
      </div>

      <div className="flex-1" />

      {/* Unlimited badge */}
      <span className="text-xs text-muted-foreground dark:text-zinc-400 hidden md:block">
        Unlimited Meetings
      </span>

      {/* Upgrade */}
      <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors">
        Upgrade
      </button>

      {/* Capture */}
      <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
        <Video className="w-3.5 h-3.5" />
        Capture
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>

      {/* Mic */}
      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent dark:hover:bg-zinc-800 transition-colors">
        <Mic className="w-4 h-4 text-muted-foreground dark:text-zinc-400" />
      </button>

      {/* Bell */}
      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent dark:hover:bg-zinc-800 transition-colors relative">
        <Bell className="w-4 h-4 text-muted-foreground dark:text-zinc-400" />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
        A
      </div>
    </header>
  );
}