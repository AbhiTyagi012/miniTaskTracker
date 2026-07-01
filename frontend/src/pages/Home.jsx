import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    tasks,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    addTask,
    markComplete,
    removeTask,
  } = useTasks();

  const counts = useMemo(() => {
    const all = tasks.length;
    const open = tasks.filter((t) => t.status === "open").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { all, open, completed };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">TaskTracker</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          filter={filter}
          search={search}
          onComplete={markComplete}
          onDelete={removeTask}
        />
      </main>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
}
