"use client";

import { useState } from "react";
import { useCreateMeeting } from "@/hooks/use-api";
import { X, Loader2, Plus, Users } from "lucide-react";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const createMeeting = useCreateMeeting();
  
  // Form States
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("60"); // default 60 mins
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  
  // Participant Entry States
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = participantInput.trim();
    if (cleanName && !participants.includes(cleanName)) {
      setParticipants([...participants, cleanName]);
      setParticipantInput("");
    }
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !transcript.trim()) return;

    // Duration converted from minutes to seconds for backend
    const durationInSeconds = parseInt(duration, 10) * 60 || 3600;

    createMeeting.mutate(
      {
        title: title.trim(),
        duration: durationInSeconds,
        summary: summary.trim() || undefined,
        participant_names: participants,
        transcript: transcript.trim(),
      },
      {
        onSuccess: () => {
          // Clear and exit state
          setTitle("");
          setDuration("60");
          setSummary("");
          setTranscript("");
          setParticipants([]);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Canvas */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">New Meeting</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint Planning Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-background text-foreground border border-border px-3.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Configuration Dual Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm bg-background text-foreground border border-border px-3.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Participants Injection Entry */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Participants
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type name and press +"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddParticipant(e);
                    }
                  }}
                  className="w-full text-sm bg-background text-foreground border border-border px-3.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Participants Display Layout */}
          {participants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 bg-muted/40 rounded-lg border border-border">
              {participants.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 text-xs text-foreground bg-accent border border-border px-2.5 py-1 rounded-full"
                >
                  <Users className="w-3 h-3 text-muted-foreground" />
                  {p}
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(p)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors text-sm font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Optional Pre-filled Summary */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Summary (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Provide a high level brief if known..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-sm bg-background text-foreground border border-border px-3.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>

          {/* Raw Text Transcript Textarea Container */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Paste Transcript <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={6}
              placeholder="John:&#10;Let's start sprint planning.&#10;&#10;Sarah:&#10;Authentication first."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full font-mono text-xs bg-background text-foreground border border-border px-3.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={createMeeting.isPending}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMeeting.isPending || !title.trim() || !transcript.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {createMeeting.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}