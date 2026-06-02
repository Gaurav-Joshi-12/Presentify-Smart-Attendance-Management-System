package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.ProfessorDto;
import com.ATMS.ATMS_BACKEND.Models.College;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Professor;
import com.ATMS.ATMS_BACKEND.Repository.CollegeRepository;
import com.ATMS.ATMS_BACKEND.Repository.DepartmentRepository;
import com.ATMS.ATMS_BACKEND.Repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProfessorService {
    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    DepartmentRepository departmentRepository;



    // ADD PROFESSOR
    public void addProfessor(ProfessorDto professorDto)
            throws Exception {

        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(
                        professorDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        professorDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        Professor professor = new Professor();

        professor.setFirstName(
                professorDto.getFirstName());

        professor.setLastName(
                professorDto.getLastName());

        professor.setEmail(
                professorDto.getEmail());

        professor.setPassword(
                professorDto.getPassword());

        professor.setPhoneNo(
                professorDto.getPhoneNo());

        professor.setDesignation(
                professorDto.getDesignation());

        professor.setJoiningDate(
                professorDto.getJoiningDate());



        // Temporary employee id generation
        professor.setEmployeeId(
                "TR" + System.currentTimeMillis());



        professor.setCollege(college);

        professor.setDepartment(department);

        professor.setCreatedAt(
                LocalDateTime.now());

        professor.setActive(true);



        professorRepository.save(professor);
    }



    // GET ALL PROFESSORS
    public List<ProfessorDto> getAllProfessors(){

        List<Professor> professorList =
                professorRepository.findByActiveTrue();

        List<ProfessorDto> professorDtoList =
                new ArrayList<>();



        for(Professor professor : professorList){

            ProfessorDto professorDto =
                    new ProfessorDto();

            professorDto.setProfessorId(
                    professor.getProfessorId());

            professorDto.setFirstName(
                    professor.getFirstName());

            professorDto.setLastName(
                    professor.getLastName());

            professorDto.setEmail(
                    professor.getEmail());

            professorDto.setPassword(
                    professor.getPassword());

            professorDto.setPhoneNo(
                    professor.getPhoneNo());

            professorDto.setDesignation(
                    professor.getDesignation());

            professorDto.setJoiningDate(
                    professor.getJoiningDate());

            professorDto.setCollegeId(
                    professor.getCollege()
                            .getCollegeId());

            professorDto.setDepartmentId(
                    professor.getDepartment()
                            .getDepartmentId());



            professorDtoList.add(professorDto);
        }

        return professorDtoList;
    }



    // GET PROFESSOR BY ID
    public ProfessorDto getProfessorById(Long id)
            throws Exception{

        Professor professor = professorRepository
                .findByProfessorIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Professor Not Found"));



        ProfessorDto professorDto =
                new ProfessorDto();

        professorDto.setProfessorId(
                professor.getProfessorId());

        professorDto.setFirstName(
                professor.getFirstName());

        professorDto.setLastName(
                professor.getLastName());

        professorDto.setEmail(
                professor.getEmail());

        professorDto.setPassword(
                professor.getPassword());

        professorDto.setPhoneNo(
                professor.getPhoneNo());

        professorDto.setDesignation(
                professor.getDesignation());

        professorDto.setJoiningDate(
                professor.getJoiningDate());

        professorDto.setCollegeId(
                professor.getCollege().getCollegeId());

        professorDto.setDepartmentId(
                professor.getDepartment()
                        .getDepartmentId());



        return professorDto;
    }



    // UPDATE PROFESSOR
    public void updateProfessor(Long id,
                                ProfessorDto professorDto)
            throws Exception{

        Professor professor = professorRepository
                .findByProfessorIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Professor Not Found"));



        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(
                        professorDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        professorDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        professor.setFirstName(
                professorDto.getFirstName());

        professor.setLastName(
                professorDto.getLastName());

        professor.setEmail(
                professorDto.getEmail());

        professor.setPassword(
                professorDto.getPassword());

        professor.setPhoneNo(
                professorDto.getPhoneNo());

        professor.setDesignation(
                professorDto.getDesignation());

        professor.setJoiningDate(
                professorDto.getJoiningDate());

        professor.setCollege(college);

        professor.setDepartment(department);



        professorRepository.save(professor);
    }



    // SOFT DELETE PROFESSOR
    public void deleteProfessor(Long id)
            throws Exception{

        Professor professor = professorRepository
                .findByProfessorIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Professor Not Found"));



        professor.setActive(false);

        professorRepository.save(professor);
    }
}
