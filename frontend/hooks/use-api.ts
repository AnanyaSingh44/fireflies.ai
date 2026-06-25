"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, mapMeeting, mapMeetings } from "@/lib/api";
import type { Meeting, ActionItem } from "@/lib/mock-data";

// -------------------- Meetings --------------------
export function useMeetings(
  sort: string = "recent",
  dateFilter: string = "all"
) {
  return useQuery({
    queryKey: ["meetings", sort, dateFilter],

    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("sort", sort);
      params.append("date_filter", dateFilter);

      const data = await api.get<any[]>(
        `/meetings?${params.toString()}`
      );

      return mapMeetings(data);
    },
  });
}

export function useSearchMeetings(query: string) {
  return useQuery({
    queryKey: ["meeting-search", query],

    enabled: query.trim().length > 0,

    queryFn: async () => {
      const data = await api.get<any[]>(
        `/meetings/search?q=${encodeURIComponent(query)}`
      );

      return mapMeetings(data);
    },
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ["meeting", id],
    queryFn: async () => {
      const data = await api.get<Meeting>(`/meetings/${id}`);
      return mapMeeting(data);
    },
    enabled: !!id,
  });
}
export interface CreateMeetingPayload {
  title: string;
  duration: number;
  summary?: string;
  media_url?: string;
  participant_names: string[];
  transcript: string;
}
export function useCreateMeeting() {
  const qc = useQueryClient();

return useMutation({
    mutationFn: (body: CreateMeetingPayload) =>
      api.post("/meetings", body),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

export function useUpdateMeeting() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Meeting> & { id: string }) =>
      api.put(`/meetings/${id}`, body),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["meeting", variables.id] });
    },
  });
}

export function useDeleteMeeting() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/meetings/${id}`),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

// -------------------- Transcripts --------------------

export function useTranscript(meetingId: string) {
  return useQuery({
    queryKey: ["transcript", meetingId],
    queryFn: async () => {
  const data = await api.get<any[]>(
    `/transcripts/meeting/${meetingId}`
  );

  return data.map((t) => ({
    id: String(t.id),
    speakerName: t.speaker,
    speakerEmail: "",
    startTime: t.start_time,
    endTime: t.end_time,
    text: t.text,
  }));
},
    enabled: !!meetingId,
  });
}


export function useTranscriptSearch(meetingId: string, q: string) {
  return useQuery({
    queryKey: ["transcript", meetingId, q],
   queryFn: async () => {
  const data = await api.get<any[]>(
    `/transcripts/${meetingId}/search?q=${encodeURIComponent(q)}`
  );

  return data.map((t) => ({
    id: String(t.id),
    speakerName: t.speaker,
    speakerEmail: "",
    startTime: t.start_time,
    endTime: t.end_time,
    text: t.text,
  }));
},
    enabled: !!meetingId,
  });
}

// -------------------- Action Items --------------------

// -------------------- Action Items --------------------

// -------------------- Action Items --------------------

export function useActionItems(meetingId: string) {
  return useQuery({
    queryKey: ["action-items", meetingId],
    queryFn: async () => {
      const data = await api.get<any[]>("/action-items");

      return data
        .filter((item) => item.meeting_id === Number(meetingId))
        .map((item) => ({
          id: String(item.id),
          text: item.task,
          completed: item.completed,
          meetingId: String(item.meeting_id),
          assignee: "",
          dueDate: "",
        }));
    },
    enabled: !!meetingId,
  });
}
export function useCreateActionItem(meetingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (task: string) =>
      api.post("/action-items", {
        meeting_id: Number(meetingId),
        task,
        completed: false,
      }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["action-items", meetingId],
      });
    },
  });
}

export function useUpdateActionItem(meetingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      text,
      completed,
    }: {
      id: string;
      text: string;
      completed: boolean;
    }) =>
      api.put(`/action-items/${id}`, {
        task: text,
        completed,
      }),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["action-items", meetingId],
      });
    },
  });
}

export function useDeleteActionItem(meetingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/action-items/${id}`),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["action-items", meetingId],
      });
    },
  });
}

// -------------------- Topics --------------------

export function useTopics(meetingId: string) {
  return useQuery({
    queryKey: ["topics", meetingId],
    queryFn: async () => {
      const data = await api.get<any[]>(`/topics/${meetingId}`);

      return data.map((t) => ({
        id: String(t.id),
        label: t.title,
        summary: t.summary,
        timestamp: t.start_time,
        duration: t.end_time - t.start_time,
      }));
    },
    enabled: !!meetingId,
  });
}

// -------------------- Summary --------------------

export function useUpdateSummary(meetingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (summary: string) =>
      api.patch(`/meetings/${meetingId}/summary`, {
        summary,
      }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meeting", meetingId] });
      qc.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}