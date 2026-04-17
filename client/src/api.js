import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

// GET all trees
export const getTrees = () => API.get("/trees");

// CREATE tree
export const createTree = (data) => API.post("/trees", data);

// UPDATE tree
export const updateTree = (id, data) => API.put(`/trees/${id}`, data);