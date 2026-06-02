package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.SubjectDto;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Subject;
import com.ATMS.ATMS_BACKEND.Repository.DepartmentRepository;
import com.ATMS.ATMS_BACKEND.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    DepartmentRepository departmentRepository;



    // ADD SUBJECT
    public void addSubject(SubjectDto subjectDto)
            throws Exception {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        subjectDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        Subject subject = new Subject();

        subject.setSubjectName(
                subjectDto.getSubjectName());

        subject.setSubjectCode(
                subjectDto.getSubjectCode());

        subject.setCredits(
                subjectDto.getCredits());

        subject.setSemester(
                subjectDto.getSemester());



        subject.setDepartment(department);

        subject.setActive(true);



        subjectRepository.save(subject);
    }



    // GET ALL SUBJECTS
    public List<SubjectDto> getAllSubjects(){

        List<Subject> subjectList =
                subjectRepository.findByActiveTrue();

        List<SubjectDto> subjectDtoList =
                new ArrayList<>();



        for(Subject subject : subjectList){

            SubjectDto subjectDto = new SubjectDto();
            subjectDto.setSubjectId(subject.getSubjectId());
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

        return subjectDtoList;
    }



    // GET SUBJECT BY ID
    public SubjectDto getSubjectById(Long id)
            throws Exception{

        Subject subject = subjectRepository
                .findBySubjectIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Subject Not Found"));



        SubjectDto subjectDto = new SubjectDto();
        subjectDto.setSubjectId(subject.getSubjectId());
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



        return subjectDto;
    }



    // UPDATE SUBJECT
    public void updateSubject(Long id,
                              SubjectDto subjectDto)
            throws Exception{

        Subject subject = subjectRepository
                .findBySubjectIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Subject Not Found"));



        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        subjectDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        subject.setSubjectName(
                subjectDto.getSubjectName());

        subject.setSubjectCode(
                subjectDto.getSubjectCode());

        subject.setCredits(
                subjectDto.getCredits());

        subject.setSemester(
                subjectDto.getSemester());



        subject.setDepartment(department);



        subjectRepository.save(subject);
    }



    // SOFT DELETE SUBJECT
    public void deleteSubject(Long id)
            throws Exception{

        Subject subject = subjectRepository
                .findBySubjectIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Subject Not Found"));



        subject.setActive(false);

        subjectRepository.save(subject);
    }
}
