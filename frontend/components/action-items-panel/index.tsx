"use client";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useActionItems,
  useCreateActionItem,
  useUpdateActionItem,
  useDeleteActionItem,
} from "@/hooks/use-api";

export function ActionItemsPanel({ meetingId }: { meetingId: string }) {
  const { data: items, isLoading } = useActionItems(meetingId);
  const createMutation = useCreateActionItem(meetingId);
  const updateMutation = useUpdateActionItem(meetingId);
  const deleteMutation = useDeleteActionItem(meetingId);

  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await createMutation.mutateAsync(newText.trim());
    setNewText("");
    setAdding(false);
  };

  const handleToggle = (
    id: string,
    text: string,
    completed: boolean
  ) => {
    updateMutation.mutate({
      id,
      text,
      completed: !completed,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-purple-400 dark:text-purple-300" />
      </div>
    );

  const open = items?.filter((i) => !i.completed) ?? [];
  const done = items?.filter((i) => i.completed) ?? [];

  return (
    <div className="space-y-4">
      {/* Open items */}
      <div>
        {open.length === 0 && done.length === 0 && !adding && (
          <p className="text-md text-gray-400 dark:text-gray-500 text-center py-4">
            No action items yet
          </p>
        )}

        <div className="space-y-2">
          {open.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <button
                onClick={() =>
                  handleToggle(item.id, item.text, item.completed)
                }
                className="mt-0.5 text-gray-300 dark:text-zinc-600 hover:text-purple-500 transition-colors shrink-0"
              >
                <Circle className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-md text-gray-700 dark:text-gray-200 leading-relaxed">
                  {item.text}
                </p>

                {item.assignee && (
                  <span className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 mt-1">
                    <User className="w-2.5 h-2.5" />
                    {item.assignee}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-zinc-600 hover:text-red-400 transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed items */}
      {done.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            Completed ({done.length})
          </p>

          <div className="space-y-2">
            {done.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors opacity-60"
              >
                <button
                  onClick={() =>
                    handleToggle(item.id, item.text, item.completed)
                  }
                  className="mt-0.5 text-green-500 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <p className="text-md text-gray-500 dark:text-gray-400 line-through leading-relaxed flex-1">
                  {item.text}
                </p>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-zinc-600 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new */}
      {adding ? (
        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-2 bg-purple-50/50 dark:bg-purple-950/20">
          <textarea
            autoFocus
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") {
                setAdding(false);
                setNewText("");
              }
            }}
            placeholder="Describe the action item…"
            className="w-full text-md text-gray-700 dark:text-gray-200 bg-transparent resize-none outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            rows={2}
          />

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleAdd}
              disabled={!newText.trim() || createMutation.isPending}
              className="text-md font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-3 py-1 rounded-md transition-colors"
            >
              {createMutation.isPending ? "Adding…" : "Add"}
            </button>

            <button
              onClick={() => {
                setAdding(false);
                setNewText("");
              }}
              className="text-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-md text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors w-full px-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add action item
        </button>
      )}
    </div>
  );
}