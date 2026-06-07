package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.StudentDto;
import com.ATMS.ATMS_BACKEND.DTO.SubjectDto;
import com.ATMS.ATMS_BACKEND.DTO.AttendanceDto;
import com.ATMS.ATMS_BACKEND.Models.College;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Student;
import com.ATMS.ATMS_BACKEND.Models.Subject;
import com.ATMS.ATMS_BACKEND.Models.Attendance;
import com.ATMS.ATMS_BACKEND.Repository.CollegeRepository;
import com.ATMS.ATMS_BACKEND.Repository.DepartmentRepository;
import com.ATMS.ATMS_BACKEND.Repository.StudentRepository;
import com.ATMS.ATMS_BACKEND.Repository.SubjectRepository;
import com.ATMS.ATMS_BACKEND.Repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {
    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    AttendanceRepository attendanceRepository;



    // ADD STUDENT
    public void addStudent(StudentDto studentDto)
            throws Exception {

        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(
                        studentDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        studentDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        Student student = new Student();

        student.setRollNo(
                studentDto.getRollNo());

        student.setFirstName(
                studentDto.getFirstName());

        student.setLastName(
                studentDto.getLastName());

        student.setEmail(
                studentDto.getEmail());

        student.setPassword(
                studentDto.getPassword());

        student.setPhoneNo(
                studentDto.getPhoneNo());

        student.setGender(
                studentDto.getGender());

        student.setDob(
                studentDto.getDob());

        student.setYear(
                studentDto.getYear());

        student.setSemester(
                studentDto.getSemester());

        student.setDivision(
                studentDto.getDivision());

        student.setAdmissionDate(
                studentDto.getAdmissionDate());



        student.setCollege(college);

        student.setDepartment(department);

        student.setCreatedAt(
                LocalDateTime.now());

        student.setActive(true);



        studentRepository.save(student);
    }



    // GET ALL STUDENTS
    public List<StudentDto> getAllStudents(){

        List<Student> studentList =
                studentRepository.findByActiveTrue();

        List<StudentDto> studentDtoList =
                new ArrayList<>();



        for(Student student : studentList){

            StudentDto studentDto = new StudentDto();
            studentDto.setStudentId(student.getStudentId());
            studentDto.setRollNo(
                    student.getRollNo());

            studentDto.setFirstName(
                    student.getFirstName());

            studentDto.setLastName(
                    student.getLastName());

            studentDto.setEmail(
                    student.getEmail());

            studentDto.setPassword(
                    student.getPassword());

            studentDto.setPhoneNo(
                    student.getPhoneNo());

            studentDto.setGender(
                    student.getGender());

            studentDto.setDob(
                    student.getDob());

            studentDto.setYear(
                    student.getYear());

            studentDto.setSemester(
                    student.getSemester());

            studentDto.setDivision(
                    student.getDivision());

            studentDto.setAdmissionDate(
                    student.getAdmissionDate());

            studentDto.setCollegeId(
                    student.getCollege()
                            .getCollegeId());

            studentDto.setDepartmentId(
                    student.getDepartment()
                            .getDepartmentId());



            studentDtoList.add(studentDto);
        }

        return studentDtoList;
    }



    // GET STUDENT BY ID
    public StudentDto getStudentById(Long id)
            throws Exception{

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        StudentDto studentDto = new StudentDto();
        studentDto.setStudentId(student.getStudentId());
        studentDto.setRollNo(
                student.getRollNo());

        studentDto.setFirstName(
                student.getFirstName());

        studentDto.setLastName(
                student.getLastName());

        studentDto.setEmail(
                student.getEmail());

        studentDto.setPassword(
                student.getPassword());

        studentDto.setPhoneNo(
                student.getPhoneNo());

        studentDto.setGender(
                student.getGender());

        studentDto.setDob(
                student.getDob());

        studentDto.setYear(
                student.getYear());

        studentDto.setSemester(
                student.getSemester());

        studentDto.setDivision(
                student.getDivision());

        studentDto.setAdmissionDate(
                student.getAdmissionDate());

        studentDto.setCollegeId(
                student.getCollege().getCollegeId());

        studentDto.setDepartmentId(
                student.getDepartment()
                        .getDepartmentId());



        return studentDto;
    }

    // GET STUDENTS BY CLASS
    public List<StudentDto> getStudentsByClass(
            Integer year,
            Integer semester,
            String division,
            Long departmentId)
            throws Exception {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(departmentId)
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        List<Student> studentList =
                studentRepository
                        .findByYearAndSemesterAndDivisionAndDepartmentAndActiveTrue(
                                year,
                                semester,
                                division,
                                department);



        List<StudentDto> studentDtoList =
                new ArrayList<>();



        for(Student student : studentList){

            StudentDto studentDto = new StudentDto();
            studentDto.setStudentId(student.getStudentId());
            studentDto.setRollNo(student.getRollNo());

            studentDto.setFirstName(student.getFirstName());

            studentDto.setLastName(student.getLastName());

            studentDto.setEmail(student.getEmail());

            studentDto.setPhoneNo(student.getPhoneNo());

            studentDto.setGender(student.getGender());

            studentDto.setDob(student.getDob());

            studentDto.setYear(student.getYear());

            studentDto.setSemester(student.getSemester());

            studentDto.setDivision(student.getDivision());

            studentDto.setAdmissionDate(
                    student.getAdmissionDate());

            studentDto.setCollegeId(
                    student.getCollege().getCollegeId());

            studentDto.setDepartmentId(
                    student.getDepartment().getDepartmentId());



            studentDtoList.add(studentDto);
        }

        return studentDtoList;
    }

    // GET STUDENTS BY COLLEGE
    public List<StudentDto> getStudentsByCollege(Long collegeId)
            throws Exception {

        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(collegeId)
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        List<Student> studentList =
                studentRepository
                        .findByCollegeAndActiveTrue(college);



        List<StudentDto> studentDtoList =
                new ArrayList<>();



        for(Student student : studentList){

            StudentDto studentDto = new StudentDto();
            studentDto.setStudentId(student.getStudentId());
            studentDto.setRollNo(student.getRollNo());

            studentDto.setFirstName(student.getFirstName());

            studentDto.setLastName(student.getLastName());

            studentDto.setEmail(student.getEmail());

            studentDto.setPhoneNo(student.getPhoneNo());

            studentDto.setGender(student.getGender());

            studentDto.setDob(student.getDob());

            studentDto.setYear(student.getYear());

            studentDto.setSemester(student.getSemester());

            studentDto.setDivision(student.getDivision());

            studentDto.setAdmissionDate(
                    student.getAdmissionDate());

            studentDto.setCollegeId(
                    student.getCollege().getCollegeId());

            studentDto.setDepartmentId(
                    student.getDepartment().getDepartmentId());



            studentDtoList.add(studentDto);
        }

        return studentDtoList;
    }



    // UPDATE STUDENT
    public void updateStudent(Long id,
                              StudentDto studentDto)
            throws Exception{

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(
                        studentDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        studentDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        student.setRollNo(
                studentDto.getRollNo());

        student.setFirstName(
                studentDto.getFirstName());

        student.setLastName(
                studentDto.getLastName());

        student.setEmail(
                studentDto.getEmail());

        student.setPassword(
                studentDto.getPassword());

        student.setPhoneNo(
                studentDto.getPhoneNo());

        student.setGender(
                studentDto.getGender());

        student.setDob(
                studentDto.getDob());

        student.setYear(
                studentDto.getYear());

        student.setSemester(
                studentDto.getSemester());

        student.setDivision(
                studentDto.getDivision());

        student.setAdmissionDate(
                studentDto.getAdmissionDate());



        student.setCollege(college);

        student.setDepartment(department);



        studentRepository.save(student);
    }



    // SOFT DELETE STUDENT
    public void deleteStudent(Long id)
            throws Exception{

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        student.setActive(false);

        studentRepository.save(student);
    }



    // GET STUDENT BY EMAIL
    public StudentDto getStudentByEmail(String email)
            throws Exception {

        Student student = studentRepository
                .findByEmailAndActiveTrue(email)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        StudentDto studentDto = new StudentDto();

        studentDto.setStudentId(student.getStudentId());

        studentDto.setRollNo(
                student.getRollNo());

        studentDto.setFirstName(
                student.getFirstName());

        studentDto.setLastName(
                student.getLastName());

        studentDto.setEmail(
                student.getEmail());

        studentDto.setPassword(
                student.getPassword());

        studentDto.setPhoneNo(
                student.getPhoneNo());

        studentDto.setGender(
                student.getGender());

        studentDto.setDob(
                student.getDob());

        studentDto.setYear(
                student.getYear());

        studentDto.setSemester(
                student.getSemester());

        studentDto.setDivision(
                student.getDivision());

        studentDto.setAdmissionDate(
                student.getAdmissionDate());

        studentDto.setCollegeId(
                student.getCollege()
                        .getCollegeId());

        studentDto.setDepartmentId(
                student.getDepartment()
                        .getDepartmentId());



        return studentDto;
    }



    // GET STUDENTS SUBJECTS
    public List<SubjectDto> getStudentsSubjects(Long studentId)
            throws Exception {

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(studentId)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        List<Subject> subjects = new ArrayList<>(student.getSubjects());

        List<Subject> deptSemesterSubjects = subjectRepository
                .findByDepartmentAndSemesterAndActiveTrue(
                        student.getDepartment(),
                        student.getSemester());

        for (Subject s : deptSemesterSubjects) {
            if (!subjects.contains(s)) {
                subjects.add(s);
            }
        }



        List<SubjectDto> subjectDtoList =
                new ArrayList<>();



        for(Subject subject : subjects){

            if(Boolean.TRUE.equals(subject.getActive())){

                SubjectDto subjectDto = new SubjectDto();

                subjectDto.setSubjectId(
                        subject.getSubjectId());

                subjectDto.setSubjectName(
                        subject.getSubjectName());

                subjectDto.setSubjectCode(
                        subject.getSubjectCode());

                subjectDto.setCredits(
                        subject.getCredits());

                subjectDto.setSemester(
                        subject.getSemester());

                subjectDto.setDepartmentId(
                        subject.getDepartment()
                                .getDepartmentId());



                subjectDtoList.add(subjectDto);
            }
        }



        return subjectDtoList;
    }



    // GET STUDENTS ATTENDANCE
    public List<AttendanceDto> getStudentsAttendance(Long studentId)
            throws Exception {

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(studentId)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        List<Attendance> attendanceList =
                attendanceRepository
                        .findByStudent(student);



        List<AttendanceDto> attendanceDtoList =
                new ArrayList<>();



        for(Attendance attendance : attendanceList){

            AttendanceDto attendanceDto =
                    new AttendanceDto();

            attendanceDto.setAttendanceStatus(
                    attendance.getAttendanceStatus());

            attendanceDto.setRemarks(
                    attendance.getRemarks());

            attendanceDto.setLectureId(
                    attendance.getLecture()
                            .getLectureId());

            attendanceDto.setStudentId(
                    student.getStudentId());

            attendanceDto.setMarkedAt(
                    attendance.getMarkedAt());

            attendanceDtoList.add(attendanceDto);
        }



        return attendanceDtoList;
    }
}
