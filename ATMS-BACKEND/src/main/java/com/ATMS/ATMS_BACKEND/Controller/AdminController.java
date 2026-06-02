package com.ATMS.ATMS_BACKEND.Controller;

import com.ATMS.ATMS_BACKEND.DTO.*;
import com.ATMS.ATMS_BACKEND.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    CollegeService collegeService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    ProfessorService professorService;

    @Autowired
    StudentService studentService;

    @Autowired
    SubjectService subjectService;

    @PostMapping("/college")
    public ResponseEntity<Map<String,String>> addCategory(@RequestBody CollegeDto collegeDto){
        try {
            collegeService.addCollege(collegeDto);
            return ResponseEntity.ok(Map.of("body","College Added Successfully"));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("body","College Not Added"));
        }
    }

    @GetMapping("/college")
    public ResponseEntity<?> getAllColleges(){
        try{
            List<CollegeDto> collegeDtoList = collegeService.getAllColleges();
            if(collegeDtoList!=null) return ResponseEntity.ok(collegeDtoList);
            else  return ResponseEntity.badRequest().body(Map.of("body","Colleges Not Found"));
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("body","Colleges Not Found"));
        }
    }

    @GetMapping("/college/{id}")
    public ResponseEntity<?> getCollegeById(@PathVariable(name = "id") Long id){
        try{
            CollegeDto collegeDto = collegeService.getCollegeById(id);
            return ResponseEntity.ok(collegeDto);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("body","Colleges Not Found"+e));
        }
    }

    @PutMapping("/college/{id}")
    public ResponseEntity<?> updateClgInfo(@RequestBody CollegeDto collegeDto,@PathVariable(name = "id") Long id){
        try{
            collegeService.updateClg(id, collegeDto);
            return ResponseEntity.ok().body(Map.of("body","College Info Updated Successfully"));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("body","Error while Updating"));
        }
    }

    @DeleteMapping("/college/{id}")
    public ResponseEntity<?> deleteCollegeById(@PathVariable(name = "id") Long id){
        try{
            collegeService.deleteClg(id);
            return ResponseEntity.ok().body(Map.of("body","College Deleted Successfully"));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("body","Error while deleting"));
        }
    }

    // Dept section

    @PostMapping("/department")
    public ResponseEntity<Map<String,String>>
    addDepartment(@RequestBody DepartmentDto departmentDto){

        try {

            departmentService.addDepartment(departmentDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Department Added Successfully"));

        }
        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Department Not Added"));
        }
    }



    @GetMapping("/department")
    public ResponseEntity<?> getAllDepartments(){

        try{

            List<DepartmentDto> departmentDtoList =
                    departmentService.getAllDepartments();

            if(departmentDtoList != null){

                return ResponseEntity.ok(departmentDtoList);
            }

            else{

                return ResponseEntity.badRequest().body(
                        Map.of("body",
                                "Departments Not Found"));
            }
        }

        catch (RuntimeException e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Departments Not Found"));
        }
    }



    @GetMapping("/department/{id}")
    public ResponseEntity<?> getDepartmentById(
            @PathVariable(name = "id") Long id){

        try{

            DepartmentDto departmentDto =
                    departmentService.getDepartmentById(id);

            return ResponseEntity.ok(departmentDto);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Department Not Found"));
        }
    }



    @PutMapping("/department/{id}")
    public ResponseEntity<?> updateDepartmentInfo(
            @RequestBody DepartmentDto departmentDto,
            @PathVariable(name = "id") Long id){

        try{

            departmentService.updateDepartment(id,
                    departmentDto);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Department Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Updating Department"));
        }
    }



    @DeleteMapping("/department/{id}")
    public ResponseEntity<?> deleteDepartmentById(
            @PathVariable(name = "id") Long id){

        try{

            departmentService.deleteDepartment(id);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Department Deleted Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Deleting Department"));
        }
    }


    // Prof Section

    @PostMapping("/professor")
    public ResponseEntity<Map<String,String>>
    addProfessor(@RequestBody ProfessorDto professorDto){

        try{

            professorService.addProfessor(professorDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Professor Added Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Professor Not Added"));
        }
    }



    @GetMapping("/professor")
    public ResponseEntity<?> getAllProfessors(){

        try{

            List<ProfessorDto> professorDtoList =
                    professorService.getAllProfessors();

            return ResponseEntity.ok(professorDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Professors Not Found"));
        }
    }



    @GetMapping("/professor/{id}")
    public ResponseEntity<?> getProfessorById(
            @PathVariable(name = "id") Long id){

        try{

            ProfessorDto professorDto =
                    professorService.getProfessorById(id);

            return ResponseEntity.ok(professorDto);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Professor Not Found"));
        }
    }



    @PutMapping("/professor/{id}")
    public ResponseEntity<?> updateProfessor(
            @RequestBody ProfessorDto professorDto,
            @PathVariable(name = "id") Long id){

        try{

            professorService.updateProfessor(id,
                    professorDto);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Professor Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Updating Professor"));
        }
    }



    @DeleteMapping("/professor/{id}")
    public ResponseEntity<?> deleteProfessor(
            @PathVariable(name = "id") Long id){

        try{

            professorService.deleteProfessor(id);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Professor Deleted Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Deleting Professor"));
        }
    }


    // Student Section

    @PostMapping("/student")
    public ResponseEntity<Map<String,String>>
    addStudent(@RequestBody StudentDto studentDto){

        try{

            studentService.addStudent(studentDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Student Added Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Student Not Added"));
        }
    }



    @GetMapping("/student")
    public ResponseEntity<?> getAllStudents(){

        try{

            List<StudentDto> studentDtoList =
                    studentService.getAllStudents();

            return ResponseEntity.ok(studentDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Students Not Found"));
        }
    }



    @GetMapping("/student/{id}")
    public ResponseEntity<?> getStudentById(
            @PathVariable(name = "id") Long id){

        try{

            StudentDto studentDto =
                    studentService.getStudentById(id);

            return ResponseEntity.ok(studentDto);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Student Not Found"));
        }
    }



    @PutMapping("/student/{id}")
    public ResponseEntity<?> updateStudent(
            @RequestBody StudentDto studentDto,
            @PathVariable(name = "id") Long id){

        try{

            studentService.updateStudent(id,
                    studentDto);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Student Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Updating Student"));
        }
    }



    @DeleteMapping("/student/{id}")
    public ResponseEntity<?> deleteStudent(
            @PathVariable(name = "id") Long id){

        try{

            studentService.deleteStudent(id);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Student Deleted Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Deleting Student"));
        }
    }

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

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Students Not Found"));
        }
    }

    // GET STUDENTS BY COLLEGE
    @GetMapping("/student/college/{id}")
    public ResponseEntity<?> getStudentsByCollege(
            @PathVariable(name = "id") Long id){

        try{

            List<StudentDto> studentDtoList =
                    studentService.getStudentsByCollege(id);

            return ResponseEntity.ok(studentDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Students Not Found"));
        }
    }

    // Subj Section

    @PostMapping("/subject")
    public ResponseEntity<Map<String,String>>
    addSubject(@RequestBody SubjectDto subjectDto){

        try{

            subjectService.addSubject(subjectDto);

            return ResponseEntity.ok(
                    Map.of("body",
                            "Subject Added Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Subject Not Added"));
        }
    }



    @GetMapping("/subject")
    public ResponseEntity<?> getAllSubjects(){

        try{

            List<SubjectDto> subjectDtoList =
                    subjectService.getAllSubjects();

            return ResponseEntity.ok(subjectDtoList);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Subjects Not Found"));
        }
    }



    @GetMapping("/subject/{id}")
    public ResponseEntity<?> getSubjectById(
            @PathVariable(name = "id") Long id){

        try{

            SubjectDto subjectDto =
                    subjectService.getSubjectById(id);

            return ResponseEntity.ok(subjectDto);
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Subject Not Found"));
        }
    }



    @PutMapping("/subject/{id}")
    public ResponseEntity<?> updateSubject(
            @RequestBody SubjectDto subjectDto,
            @PathVariable(name = "id") Long id){

        try{

            subjectService.updateSubject(id,
                    subjectDto);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Subject Updated Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Updating Subject"));
        }
    }



    @DeleteMapping("/subject/{id}")
    public ResponseEntity<?> deleteSubject(
            @PathVariable(name = "id") Long id){

        try{

            subjectService.deleteSubject(id);

            return ResponseEntity.ok().body(
                    Map.of("body",
                            "Subject Deleted Successfully"));
        }

        catch (Exception e){

            return ResponseEntity.badRequest().body(
                    Map.of("body",
                            "Error While Deleting Subject"));
        }
    }


}
