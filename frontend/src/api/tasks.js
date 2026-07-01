import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const getTasks = ({ status, search } = {}) => {
  const params = {};
  if (status && status !== "all") params.status = status;
  if (search && search.trim()) params.search = search.trim();
  return api.get("/tasks", { params }).then((r) => r.data);
};

export const createTask = (payload) =>
  api.post("/tasks", payload).then((r) => r.data);

export const updateTask = (id, payload) =>
  api.patch(`/tasks/${id}`, payload).then((r) => r.data);

export const completeTask = (id) =>
  api.patch(`/tasks/${id}`, { status: "completed" }).then((r) => r.data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);
