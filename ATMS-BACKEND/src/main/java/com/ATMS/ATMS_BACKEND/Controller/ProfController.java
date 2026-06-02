package com.ATMS.ATMS_BACKEND.Controller;

//    Lecture
//    createLecture()
//    getAllLectures()
//    getLectureById()
//    updateLecture()
//    deleteLecture()
//
//        Student
//    getStudentsByClass()
//
//    Attendance
//    markAttendance()
//    updateAttendance()
//    getAttendanceByLecture()
//    getAttendanceByStudent()
//    getAttendanceBySubject()
//    getStudentAttendancePercentage()

import com.ATMS.ATMS_BACKEND.DTO.AttendanceDto;
import com.ATMS.ATMS_BACKEND.DTO.LectureDto;
import com.ATMS.ATMS_BACKEND.DTO.StudentDto;
import com.ATMS.ATMS_BACKEND.Service.AttendanceEventService;
import com.ATMS.ATMS_BACKEND.Service.LectureService;
import com.ATMS.ATMS_BACKEND.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/prof")
@RestController
public class ProfController {

    @Autowired
    LectureService lectureService;

    @Autowired
    StudentService studentService;

    @Autowired
    AttendanceEventService attendanceService;


    @PostMapping("/lecture")
    public ResponseEntity<?>
    addLecture(@RequestBody LectureDto lectureDto){

        try{

            com.ATMS.ATMS_BACKEND.Models.Lecture lecture = lectureService.addLecture(lectureDto);

            return ResponseEntity.ok(
                    Map.of("body", "Lecture Added Successfully",
                           "lectureId", lecture.getLectureId().toString()));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Lecture Not Added"));
        }
    }


    @GetMapping("/lecture")
    public ResponseEntity<?> getAllLectures(){

        try{

            List<LectureDto> lectureDtoList =
                    lectureService.getAllLectures();

            return ResponseEntity.ok(lectureDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Lectures Not Found"));
        }
    }



    @GetMapping("/lecture/{id}")
    public ResponseEntity<?> getLectureById(
            @PathVariable(name = "id") Long id){

        try{

            LectureDto lectureDto =
                    lectureService.getLectureById(id);

            return ResponseEntity.ok(lectureDto);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Lecture Not Found"));
        }
    }



    @PutMapping("/lecture/{id}")
    public ResponseEntity<?> updateLecture(
            @RequestBody LectureDto lectureDto,
            @PathVariable(name = "id") Long id){

        try{

            lectureService.updateLecture(id,
                    lectureDto);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Lecture Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Updating Lecture"));
        }
    }



    @DeleteMapping("/lecture/{id}")
    public ResponseEntity<?> deleteLecture(
            @PathVariable(name = "id") Long id) {

        try {

            lectureService.deleteLecture(id);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Lecture Deleted Successfully"));
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Deleting Lecture"));
        }

    }

    // Student Section

    // GET STUDENTS BY CLASS
    @GetMapping("/student/class")
    public ResponseEntity<?> getStudentsByClass(

            @RequestParam Integer year,

            @RequestParam Integer semester,

            @RequestParam String division,

            @RequestParam Long departmentId){

        try{

            List<StudentDto> studentDtoList =
                    studentService.getStudentsByClass(
                            year,
                            semester,
                            division,
                            departmentId);

            return ResponseEntity.ok(studentDtoList);
        }

        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Students Not Found"));
        }
    }

    // Attendance Section

    // MARK ATTENDANCE
    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceDto attendanceDto){

        try{

            attendanceService
                    .markAttendance(attendanceDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Attendance Marked Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Marked"+e));
        }
    }

    // UPDATE ATTENDANCE
    @PutMapping("/attendance/{id}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable(name = "id") Long id,
            @RequestBody AttendanceDto attendanceDto){

        try{

            attendanceService
                    .updateAttendance(id,
                            attendanceDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Attendance Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Updated"));
        }
    }

    // GET ATTENDANCE BY LECTURE
    @GetMapping("/attendance/lecture/{id}")
    public ResponseEntity<?> getAttendanceByLecture(
            @PathVariable(name = "id") Long id){

        try{

            List<AttendanceDto> attendanceDtoList =
                    attendanceService
                            .getAttendanceByLecture(id);

            return ResponseEntity.ok(attendanceDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Found"));
        }
    }

    // GET ATTENDANCE BY STUDENT
    @GetMapping("/attendance/student/{id}")
    public ResponseEntity<?> getAttendanceByStudent(
            @PathVariable(name = "id") Long id){

        try{

            List<AttendanceDto> attendanceDtoList =
                    attendanceService
                            .getAttendanceByStudent(id);

            return ResponseEntity.ok(attendanceDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Found"));
        }
    }

    // GET ATTENDANCE BY SUBJECT
    @GetMapping("/attendance/subject/{id}")
    public ResponseEntity<?> getAttendanceBySubject(
            @PathVariable(name = "id") Long id){

        try{

            List<AttendanceDto> attendanceDtoList =
                    attendanceService
                            .getAttendanceBySubject(id);

            return ResponseEntity.ok(attendanceDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Found"));
        }
    }

    // GET ATTENDANCE PERCENTAGE
    @GetMapping("/attendance/percentage/{id}")
    public ResponseEntity<?> getAttendancePercentage(
            @PathVariable(name = "id") Long id){

        try{

            Double percentage =
                    attendanceService
                            .getStudentAttendancePercentage(id);

            return ResponseEntity.ok(
                    Map.of("attendancePercentage",
                            percentage.toString()));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Percentage Not Found"));
        }
    }


}
