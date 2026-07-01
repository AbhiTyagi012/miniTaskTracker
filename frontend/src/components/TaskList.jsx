import TaskCard from "./TaskCard";

export default function TaskList({ tasks, loading, error, filter, search, onComplete, onDelete }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">{error}</p>
        <p className="text-sm text-gray-400 mt-1">Check that the backend is running.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    const isFiltered = filter !== "all" || search;
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        {isFiltered ? (
          <>
            <p className="text-gray-700 font-medium">No tasks match your search</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting the filter or search term.</p>
          </>
        ) : (
          <>
            <p className="text-gray-700 font-medium">No tasks yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first task using the button above.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
