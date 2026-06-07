import { a as api } from "./api-Rs_hdI2y.js";
const profService = {
  // Subjects taught by the professor (fallback to all subjects for the dept)
  listSubjects: () => api.get("/api/admin/subject").then((r) => r.data),
  // Lecture
  createLecture: (data) => api.post("/api/prof/lecture", data).then((r) => r.data),
  listAllLectures: () => api.get("/api/prof/lecture").then((r) => r.data),
  listLecturesBySubject: (subjectId) => api.get("/api/prof/lecture").then((r) => r.data.filter((l) => l.subjectId === subjectId)).catch(() => []),
  getLectureById: (lectureId) => api.get(`/api/prof/lecture/${lectureId}`).then((r) => r.data),
  // Class roster
  listClassStudents: (params) => api.get("/api/prof/student/class", { params }).then((r) => r.data),
  // Attendance
  markAttendance: (data) => api.post("/api/prof/attendance", data).then((r) => r.data),
  attendanceByLecture: (lectureId) => api.get(`/api/prof/attendance/lecture/${lectureId}`).then((r) => r.data),
  studentPercentage: (studentId, subjectId) => api.get(
    `/api/prof/attendance/percentage/${studentId}`,
    { params: subjectId ? { subjectId } : void 0 }
  ).then((r) => Number(r.data.attendancePercentage))
};
export {
  profService as p
};
