import { useState, useEffect, useCallback } from "react";
import {
  getTasks,
  createTask,
  completeTask,
  updateTask,
  deleteTask,
} from "../api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks({ status: filter, search });
      setTasks(data);
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (payload) => {
    const task = await createTask(payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const markComplete = async (id) => {
    const updated = await completeTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const editTask = async (id, payload) => {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    addTask,
    markComplete,
    editTask,
    removeTask,
    refetch: fetchTasks,
  };
}
