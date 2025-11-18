// src/pages/sellerdashboard/team/team.api.js
import api from "@/utils/axios.utils";

// LIST
export const listTeamMembers = () => api.get("/team/getteammember");

// ADD
export const addTeamMember = (data) => api.post("/team/addteammember", data);

// UPDATE
export const updateTeamMember = (id, data) =>
  api.put(`/team/update/${id}`, data);

// DELETE
export const deleteTeamMember = (id) => api.delete(`/team/delete/${id}`);
