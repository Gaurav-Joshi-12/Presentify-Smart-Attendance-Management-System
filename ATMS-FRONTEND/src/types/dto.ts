// DTO type definitions matching the Spring Boot backend exactly.

export interface CollegeDto {
  collegeId?: number;
  collegeName: string;
  collegeCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phoneNo: string;
}

export interface DepartmentDto {
  departmentId?: number;
  departmentName: string;
  departmentCode: string;
  collegeId: number;
}

export interface ProfessorDto {
  professorId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNo: string;
  designation: string;
  joiningDate: string; // YYYY-MM-DD
  collegeId: number;
  departmentId: number;
}

export interface StudentDto {
  studentId?: number;
  rollNo: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNo: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: string;
  year: number;
  semester: number;
  division: string;
  admissionDate: string;
  collegeId: number;
  departmentId: number;
}

export interface SubjectDto {
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
  credits: number;
  semester: number;
  departmentId: number;
}

export interface LectureDto {
  lectureId?: number;
  lectureDate: string;
  startTime: string;
  endTime: string;
  topic: string;
  roomNo: string;
  year: number;
  semester: number;
  division: string;
  subjectId: number;
  professorId: number;
  departmentId: number;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

export interface AttendanceDto {
  attendanceId?: number;
  attendanceStatus: AttendanceStatus;
  remarks: string;
  lectureId: number;
  studentId: number;
}

export interface ProfessorSession {
  professorId: number;
  firstName: string;
  lastName: string;
  email: string;
  collegeId: number;
  departmentId: number;
}
