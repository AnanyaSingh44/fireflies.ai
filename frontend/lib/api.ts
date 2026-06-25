const API_URL = "http://127.0.0.1:8000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};

/* ---------- Convert FastAPI -> Frontend Shape ---------- */

export function mapMeeting(m: any) {
  return {
    ...m,

    mediaUrl: m.media_url,
    media_url: m.media_url,

    actionItems: m.action_items ?? [],
    action_items: m.action_items ?? [],

    participants:
      m.participants?.map((p: any) => ({
        ...p,
        email:
          p.email ??
          `${p.name.replace(/\s+/g, "").toLowerCase()}@demo.com`,
      })) ?? [],

    status: m.status ?? "completed",

    tags: m.topics?.map((t: any) => t.title) ?? [],

    transcript: m.transcripts ?? [],
  };
}

export function mapMeetings(meetings: any[]) {
  return meetings.map(mapMeeting);
}