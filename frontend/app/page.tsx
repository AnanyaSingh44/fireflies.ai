export default function RootPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-purple-500">
          Fireflies Clone
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Meeting intelligence, reimagined.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Browse meetings, review transcripts, and manage action items from a polished workspace.
        </p>
        <a
          href="/meetings"
          className="mt-8 inline-flex items-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          Open Meetings
        </a>
      </div>
    </main>
  );
}