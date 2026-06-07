package com.ATMS.ATMS_BACKEND.Controller;

import com.ATMS.ATMS_BACKEND.DTO.AttendanceDto;
import com.ATMS.ATMS_BACKEND.DTO.StudentDto;
import com.ATMS.ATMS_BACKEND.DTO.SubjectDto;
import com.ATMS.ATMS_BACKEND.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/student")
@RestController
public class StudentController {

    @Autowired
    StudentService studentService;


    @GetMapping("/email/{email}")
    public ResponseEntity<?> getStudentByEmail(
            @PathVariable(name = "email") String email) {

        try {

            StudentDto studentDto =
                    studentService.getStudentByEmail(email);

            return ResponseEntity.ok(studentDto);
        }

        catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Student Not Found"));
        }
    }



    @GetMapping("/{id}/subjects")
    public ResponseEntity<?> getStudentsSubjects(
            @PathVariable(name = "id") Long id) {

        try {

            List<SubjectDto> subjectDtoList =
                    studentService.getStudentsSubjects(id);

            return ResponseEntity.ok(subjectDtoList);
        }

        catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Subjects Not Found"));
        }
    }



    @GetMapping("/{id}/attendance")
    public ResponseEntity<?> getStudentsAttendance(
            @PathVariable(name = "id") Long id) {

        try {

            List<AttendanceDto> attendanceDtoList =
                    studentService.getStudentsAttendance(id);

            return ResponseEntity.ok(attendanceDtoList);
        }

        catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Attendance Not Found"));
        }
    }
}
