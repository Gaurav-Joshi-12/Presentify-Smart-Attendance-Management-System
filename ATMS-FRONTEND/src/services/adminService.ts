import api from "./api";
import type {
  CollegeDto,
  DepartmentDto,
  ProfessorDto,
  StudentDto,
  SubjectDto,
} from "@/types/dto";

export const adminService = {
  // Colleges
  listColleges: () => api.get<CollegeDto[]>("/api/admin/college").then((r) => r.data),
  createCollege: (data: CollegeDto) =>
    api.post<CollegeDto>("/api/admin/college", data).then((r) => r.data),
  updateCollege: (id: number, data: CollegeDto) =>
    api.put(`/api/admin/college/${id}`, data).then((r) => r.data),
  deleteCollege: (id: number) =>
    api.delete(`/api/admin/college/${id}`).then((r) => r.data),

  // Departments
  listDepartments: () => api.get<DepartmentDto[]>("/api/admin/department").then((r) => r.data),
  createDepartment: (data: DepartmentDto) =>
    api.post<DepartmentDto>("/api/admin/department", data).then((r) => r.data),
  updateDepartment: (id: number, data: DepartmentDto) =>
    api.put(`/api/admin/department/${id}`, data).then((r) => r.data),
  deleteDepartment: (id: number) =>
    api.delete(`/api/admin/department/${id}`).then((r) => r.data),

  // Professors
  listProfessors: () => api.get<ProfessorDto[]>("/api/admin/professor").then((r) => r.data),
  createProfessor: (data: ProfessorDto) =>
    api.post<ProfessorDto>("/api/admin/professor", data).then((r) => r.data),
  updateProfessor: (id: number, data: ProfessorDto) =>
    api.put(`/api/admin/professor/${id}`, data).then((r) => r.data),
  deleteProfessor: (id: number) =>
    api.delete(`/api/admin/professor/${id}`).then((r) => r.data),

  // Students
  listStudents: () => api.get<StudentDto[]>("/api/admin/student").then((r) => r.data),
  createStudent: (data: StudentDto) =>
    api.post<StudentDto>("/api/admin/student", data).then((r) => r.data),
  updateStudent: (id: number, data: StudentDto) =>
    api.put(`/api/admin/student/${id}`, data).then((r) => r.data),
  deleteStudent: (id: number) =>
    api.delete(`/api/admin/student/${id}`).then((r) => r.data),

  // Subjects
  listSubjects: () => api.get<SubjectDto[]>("/api/admin/subject").then((r) => r.data),
  createSubject: (data: SubjectDto) =>
    api.post<SubjectDto>("/api/admin/subject", data).then((r) => r.data),
  updateSubject: (id: number, data: SubjectDto) =>
    api.put(`/api/admin/subject/${id}`, data).then((r) => r.data),
  deleteSubject: (id: number) =>
    api.delete(`/api/admin/subject/${id}`).then((r) => r.data),
};
