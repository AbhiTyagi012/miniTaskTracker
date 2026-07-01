import { useState } from "react";

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-green-50 text-green-600 border-green-200",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskCard({ task, onComplete, onDelete }) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isCompleted = task.status === "completed";

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`group bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
        isCompleted ? "border-gray-100 opacity-75" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleComplete}
          disabled={isCompleted || completing}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-indigo-500 border-indigo-500"
              : "border-gray-300 hover:border-indigo-400"
          } disabled:cursor-not-allowed`}
          aria-label={isCompleted ? "Completed" : "Mark complete"}
        >
          {(isCompleted || completing) && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-sm font-semibold text-gray-800 truncate ${
                isCompleted ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.priority && (
              <span
                className={`text-xs border rounded-full px-2 py-0.5 font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>
            )}
            {isCompleted && (
              <span className="text-xs bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-2 py-0.5 font-medium">
                Done
              </span>
            )}
          </div>

          {task.description && (
            <p className={`mt-1 text-sm leading-relaxed ${isCompleted ? "text-gray-400 line-through" : "text-gray-500"}`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>Created {formatDate(task.created_at)}</span>
            {task.due_date && (
              <span className="text-amber-500 font-medium">
                Due {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
