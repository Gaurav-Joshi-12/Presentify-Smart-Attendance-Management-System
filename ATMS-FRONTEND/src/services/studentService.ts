import api from "./api";
import type { AttendanceDto, SubjectDto, StudentDto } from "@/types/dto";

export const studentService = {
  getStudentByEmail: (email: string) =>
    api.get<StudentDto>(`/api/student/email/${email}`).then((r) => r.data),

  listStudentSubjects: (studentId: number) =>
    api.get<SubjectDto[]>(`/api/student/${studentId}/subjects`).then((r) => r.data),

  listStudentAttendance: (studentId: number) =>
    api.get<AttendanceDto[]>(`/api/student/${studentId}/attendance`).then((r) => r.data),
};
