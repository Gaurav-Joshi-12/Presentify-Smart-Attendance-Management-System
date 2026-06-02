import { a as api } from "./api-BYmOYr6M.js";
const profService = {
  // Subjects taught by the professor (fallback to all subjects for the dept)
  listSubjects: () => api.get("/api/admin/subject").then((r) => r.data),
  // Lecture
  createLecture: (data) => api.post("/api/prof/lecture", data).then((r) => r.data),
  listLecturesBySubject: (subjectId) => api.get("/api/prof/lecture").then((r) => r.data.filter((l) => l.subjectId === subjectId)).catch(() => []),
  // Class roster
  listClassStudents: (params) => api.get("/api/prof/student/class", { params }).then((r) => r.data),
  // Attendance
  markAttendance: (data) => api.post("/api/prof/attendance", data).then((r) => r.data),
  attendanceByLecture: (lectureId) => api.get(`/api/prof/attendance/lecture/${lectureId}`).then((r) => r.data),
  studentPercentage: (studentId) => api.get(`/api/prof/attendance/percentage/${studentId}`).then((r) => Number(r.data.attendancePercentage))
};
export {
  profService as p
};
