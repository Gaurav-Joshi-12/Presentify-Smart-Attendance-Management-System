package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.AttendanceDto;
import com.ATMS.ATMS_BACKEND.Enums.AttendanceStatus;
import com.ATMS.ATMS_BACKEND.Models.Attendance;
import com.ATMS.ATMS_BACKEND.Models.AttendanceEvent;
import com.ATMS.ATMS_BACKEND.Models.Lecture;
import com.ATMS.ATMS_BACKEND.Models.Student;
import com.ATMS.ATMS_BACKEND.Repository.AttendanceRepository;
import com.ATMS.ATMS_BACKEND.Repository.LectureRepository;
import com.ATMS.ATMS_BACKEND.Repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceEventService {

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    LectureRepository lectureRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    WhatsappService whatsappService;

    @Autowired
    AttendanceProducerService attendanceProducerService;





    // MARK ATTENDANCE
    public void markAttendance(
            AttendanceDto attendanceDto)
            throws Exception {

        Lecture lecture = lectureRepository
                .findById(attendanceDto.getLectureId())
                .orElseThrow(() ->
                        new Exception("Lecture Not Found"));



        Student student = studentRepository
                .findByStudentIdAndActiveTrue(
                        attendanceDto.getStudentId())
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        Attendance attendance = new Attendance();

        attendance.setAttendanceStatus(
                attendanceDto.getAttendanceStatus());

        attendance.setRemarks(
                attendanceDto.getRemarks());
        attendance.setMarkedAt(
                LocalDateTime.now());

        attendance.setLecture(lecture);
        attendance.setStudent(student);
        attendanceRepository.save(attendance);
//        whatsappService.sendWhatsappMessage("7666032435");
        AttendanceEvent attendanceEvent = new AttendanceEvent();
        attendanceEvent.setAttendanceStatus(attendance.getAttendanceStatus());
        attendanceEvent.setDate(lecture.getLectureDate().atStartOfDay());
        attendanceEvent.setSubjectName(lecture.getSubject().getSubjectName());
        attendanceEvent.setStudentName(student.getFirstName()+" "+student.getLastName());
        attendanceEvent.setSubjectTopic(lecture.getTopic());
        attendanceEvent.setTeacherName(lecture.getProfessor().getFirstName()+" "+lecture.getProfessor().getLastName());
        attendanceEvent.setStudentRemark(attendance.getRemarks());
//        attendanceEvent.setPhoneNumber(student.getPhoneNo());
        attendanceEvent.setPhoneNumber("7666032435");
//        attendanceProducerService.publish("7666032435");
        attendanceProducerService.publish(attendanceEvent);

    }



    // UPDATE ATTENDANCE
    public void updateAttendance(
            Long attendanceId,
            AttendanceDto attendanceDto)
            throws Exception {

        Attendance attendance = attendanceRepository
                .findById(attendanceId)
                .orElseThrow(() ->
                        new Exception("Attendance Not Found"));



        attendance.setAttendanceStatus(
                attendanceDto.getAttendanceStatus());

        attendance.setRemarks(
                attendanceDto.getRemarks());

        attendance.setMarkedAt(
                LocalDateTime.now());



        attendanceRepository.save(attendance);
    }



    // GET ATTENDANCE BY LECTURE
    public List<AttendanceDto>
    getAttendanceByLecture(Long lectureId)
            throws Exception {

        Lecture lecture = lectureRepository
                .findById(lectureId)
                .orElseThrow(() ->
                        new Exception("Lecture Not Found"));



        List<Attendance> attendanceList =
                attendanceRepository
                        .findByLecture(lecture);



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
                    attendance.getStudent()
                            .getStudentId());



            attendanceDtoList.add(attendanceDto);
        }

        return attendanceDtoList;
    }



    // GET ATTENDANCE BY STUDENT
    public List<AttendanceDto>
    getAttendanceByStudent(Long studentId)
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
                    attendance.getStudent()
                            .getStudentId());



            attendanceDtoList.add(attendanceDto);
        }

        return attendanceDtoList;
    }



    // GET ATTENDANCE BY SUBJECT
    public List<AttendanceDto>
    getAttendanceBySubject(Long subjectId){

        List<Attendance> attendanceList =
                attendanceRepository
                        .findByLectureSubjectSubjectId(
                                subjectId);



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
                    attendance.getStudent()
                            .getStudentId());



            attendanceDtoList.add(attendanceDto);
        }

        return attendanceDtoList;
    }



    // GET ATTENDANCE PERCENTAGE
    public Double
    getStudentAttendancePercentage(Long studentId)
            throws Exception {

        Student student = studentRepository
                .findByStudentIdAndActiveTrue(studentId)
                .orElseThrow(() ->
                        new Exception("Student Not Found"));



        List<Attendance> attendanceList =
                attendanceRepository
                        .findByStudent(student);



        int totalLectures =
                attendanceList.size();



        int presentCount = 0;



        for(Attendance attendance : attendanceList){

            if(attendance.getAttendanceStatus()
                    == AttendanceStatus.PRESENT){

                presentCount++;
            }
        }



        if(totalLectures == 0){

            return 0.0;
        }



        return ((double) presentCount
                / totalLectures) * 100;
    }
}