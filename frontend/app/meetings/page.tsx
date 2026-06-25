"use client";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { CreateMeetingModal } from "@/components/meetings/create-meeting-modal"; // 1. Imported the Modal
import { useSearchMeetings } from "@/hooks/use-api";
import { useMeetings } from "@/hooks/use-api";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  Filter,
  Check,
  Loader2,
  Plus, // 2. Imported the Plus icon for the button
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function groupByMonth(meetings: { date: string; [k: string]: unknown }[]) {
  const groups: Record<string, typeof meetings> = {};
  meetings.forEach((m) => {
    const key = format(new Date(m.date), "MMMM yyyy");
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

export default function MeetingsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [dateFilter, setDateFilter] = useState("all");
  
  // 3. Added state to track modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: meetings,
    isLoading,
  } = useMeetings(sort, dateFilter);

  const {
    data: searchedMeetings,
    isLoading: searching,
  } = useSearchMeetings(search);
  
  const displayMeetings =
    search.trim().length > 0
      ? searchedMeetings ?? []
      : meetings ?? [];

  const grouped = groupByMonth(
    displayMeetings as { date: string }[]
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="ml-[30vh] flex-1 flex flex-col">
        <Header title="Meetings" onSearch={setSearch} />

        <main className="flex-1 px-8 py-6">
          {/* Sub header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-l font-semibold text-foreground bg-card border border-border px-5 py-2.5 rounded-lg hover:bg-accent transition-colors">
                    <Calendar className="w-5 h-5" />

                    {dateFilter === "all" && "All Time"}
                    {dateFilter === "today" && "Today"}
                    {dateFilter === "week" && "Last 7 Days"}
                    {dateFilter === "month" && "Last 30 Days"}

                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuItem onClick={() => setDateFilter("all")}>
                    <div className="flex items-center justify-between w-full">
                      All Time
                      {dateFilter === "all" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setDateFilter("today")}>
                    <div className="flex items-center justify-between w-full">
                      Today
                      {dateFilter === "today" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setDateFilter("week")}>
                    <div className="flex items-center justify-between w-full">
                      Last 7 Days
                      {dateFilter === "week" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setDateFilter("month")}>
                    <div className="flex items-center justify-between w-full">
                      Last 30 Days
                      {dateFilter === "month" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-l font-semibold text-foreground bg-card border border-border px-5 py-2.5 rounded-lg hover:bg-accent transition-colors">
                    <Filter className="w-5 h-5" />

                    {sort === "recent" ? "Newest First" : "Oldest First"}

                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuItem onClick={() => setSort("recent")}>
                    <div className="flex items-center justify-between w-full">
                      Newest First
                      {sort === "recent" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setSort("oldest")}>
                    <div className="flex items-center justify-between w-full">
                      Oldest First
                      {sort === "oldest" && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 4. Added "+ New Meeting" trigger button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-purple-600 px-5 py-2.5 rounded-lg hover:bg-purple-700 shadow-sm transition-colors ml-2"
              >
                <Plus className="w-4 h-4" />
                New Meeting
              </button>
            </div>
            
            <span className="text-[2vh] font-semibold text-muted-foreground">
              {meetings?.length ?? 0} meetings
            </span>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : displayMeetings.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-[2vh] font-medium">
                No meetings found{search && ` for "${search}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([month, items]) => (
                <section key={month}>
                  <h2 className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    {month}
                  </h2>
                  <div className="space-y-3">
                    {items.map((meeting) => (
                      <MeetingCard key={meeting.id as string} meeting={meeting as never} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 5. Rendered the Overlay Modal Node */}
      <CreateMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}