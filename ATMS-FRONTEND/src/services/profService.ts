import api from "./api";
import type {
  AttendanceDto,
  LectureDto,
  StudentDto,
  SubjectDto,
} from "@/types/dto";

export const profService = {
  // Subjects taught by the professor (fallback to all subjects for the dept)
  listSubjects: () => api.get<SubjectDto[]>("/api/admin/subject").then((r) => r.data),

  // Lecture
  createLecture: (data: LectureDto) =>
    api.post<{ body: string; lectureId: string }>("/api/prof/lecture", data).then((r) => r.data),
  listAllLectures: () =>
    api.get<LectureDto[]>("/api/prof/lecture").then((r) => r.data),
  listLecturesBySubject: (subjectId: number) =>
    api
      .get<LectureDto[]>("/api/prof/lecture")
      .then((r) => r.data.filter((l) => l.subjectId === subjectId))
      .catch(() => [] as LectureDto[]),
  getLectureById: (lectureId: number) =>
    api.get<LectureDto>(`/api/prof/lecture/${lectureId}`).then((r) => r.data),

  // Class roster
  listClassStudents: (params: {
    year: number;
    semester: number;
    division: string;
    departmentId: number;
  }) =>
    api
      .get<StudentDto[]>("/api/prof/student/class", { params })
      .then((r) => r.data),

  // Attendance
  markAttendance: (data: AttendanceDto) =>
    api.post<AttendanceDto>("/api/prof/attendance", data).then((r) => r.data),

  attendanceByLecture: (lectureId: number) =>
    api
      .get<AttendanceDto[]>(`/api/prof/attendance/lecture/${lectureId}`)
      .then((r) => r.data),

  studentPercentage: (studentId: number, subjectId?: number) =>
    api
      .get<{ attendancePercentage: string }>(
        `/api/prof/attendance/percentage/${studentId}`,
        { params: subjectId ? { subjectId } : undefined }
      )
      .then((r) => Number(r.data.attendancePercentage)),
};
