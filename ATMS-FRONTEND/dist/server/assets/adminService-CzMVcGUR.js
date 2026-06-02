import { a as api } from "./api-BYmOYr6M.js";
const adminService = {
  // Colleges
  listColleges: () => api.get("/api/admin/college").then((r) => r.data),
  createCollege: (data) => api.post("/api/admin/college", data).then((r) => r.data),
  updateCollege: (id, data) => api.put(`/api/admin/college/${id}`, data).then((r) => r.data),
  deleteCollege: (id) => api.delete(`/api/admin/college/${id}`).then((r) => r.data),
  // Departments
  listDepartments: () => api.get("/api/admin/department").then((r) => r.data),
  createDepartment: (data) => api.post("/api/admin/department", data).then((r) => r.data),
  updateDepartment: (id, data) => api.put(`/api/admin/department/${id}`, data).then((r) => r.data),
  deleteDepartment: (id) => api.delete(`/api/admin/department/${id}`).then((r) => r.data),
  // Professors
  listProfessors: () => api.get("/api/admin/professor").then((r) => r.data),
  createProfessor: (data) => api.post("/api/admin/professor", data).then((r) => r.data),
  updateProfessor: (id, data) => api.put(`/api/admin/professor/${id}`, data).then((r) => r.data),
  deleteProfessor: (id) => api.delete(`/api/admin/professor/${id}`).then((r) => r.data),
  // Students
  listStudents: () => api.get("/api/admin/student").then((r) => r.data),
  createStudent: (data) => api.post("/api/admin/student", data).then((r) => r.data),
  updateStudent: (id, data) => api.put(`/api/admin/student/${id}`, data).then((r) => r.data),
  deleteStudent: (id) => api.delete(`/api/admin/student/${id}`).then((r) => r.data),
  // Subjects
  listSubjects: () => api.get("/api/admin/subject").then((r) => r.data),
  createSubject: (data) => api.post("/api/admin/subject", data).then((r) => r.data),
  updateSubject: (id, data) => api.put(`/api/admin/subject/${id}`, data).then((r) => r.data),
  deleteSubject: (id) => api.delete(`/api/admin/subject/${id}`).then((r) => r.data)
};
export {
  adminService as a
};
