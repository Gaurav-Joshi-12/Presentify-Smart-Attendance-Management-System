package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.LectureDto;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Lecture;
import com.ATMS.ATMS_BACKEND.Models.Professor;
import com.ATMS.ATMS_BACKEND.Models.Subject;
import com.ATMS.ATMS_BACKEND.Repository.DepartmentRepository;
import com.ATMS.ATMS_BACKEND.Repository.LectureRepository;
import com.ATMS.ATMS_BACKEND.Repository.ProfessorRepository;
import com.ATMS.ATMS_BACKEND.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LectureService {
    @Autowired
    LectureRepository lectureRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    DepartmentRepository departmentRepository;


    // ADD LECTURE
    public Lecture addLecture(LectureDto lectureDto)
            throws Exception {

        Subject subject = subjectRepository
                .findBySubjectIdAndActiveTrue(
                        lectureDto.getSubjectId())
                .orElseThrow(() ->
                        new Exception("Subject Not Found"));


        Professor professor = professorRepository
                .findByProfessorIdAndActiveTrue(
                        lectureDto.getProfessorId())
                .orElseThrow(() ->
                        new Exception("Professor Not Found"));


        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        lectureDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));


        Lecture lecture = new Lecture();

        lecture.setLectureDate(
                lectureDto.getLectureDate());

        lecture.setStartTime(
                lectureDto.getStartTime());

        lecture.setEndTime(
                lectureDto.getEndTime());

        lecture.setTopic(
                lectureDto.getTopic());

        lecture.setRoomNo(
                lectureDto.getRoomNo());

        lecture.setYear(
                lectureDto.getYear());

        lecture.setSemester(
                lectureDto.getSemester());

        lecture.setDivision(
                lectureDto.getDivision());


        lecture.setSubject(subject);

        lecture.setProfessor(professor);

        lecture.setDepartment(department);

        lecture.setCreatedAt(
                LocalDateTime.now());


        return lectureRepository.save(lecture);
    }


    // GET ALL LECTURES
    public List<LectureDto> getAllLectures() {

        List<Lecture> lectureList =
                lectureRepository.findAll();

        List<LectureDto> lectureDtoList =
                new ArrayList<>();


        for (Lecture lecture : lectureList) {

            LectureDto lectureDto =
                    new LectureDto();

            lectureDto.setLectureId(
                    lecture.getLectureId());

            lectureDto.setLectureDate(
                    lecture.getLectureDate());

            lectureDto.setStartTime(
                    lecture.getStartTime());

            lectureDto.setEndTime(
                    lecture.getEndTime());

            lectureDto.setTopic(
                    lecture.getTopic());

            lectureDto.setRoomNo(
                    lecture.getRoomNo());

            lectureDto.setYear(
                    lecture.getYear());

            lectureDto.setSemester(
                    lecture.getSemester());

            lectureDto.setDivision(
                    lecture.getDivision());

            lectureDto.setSubjectId(
                    lecture.getSubject()
                            .getSubjectId());

            lectureDto.setProfessorId(
                    lecture.getProfessor()
                            .getProfessorId());

            lectureDto.setDepartmentId(
                    lecture.getDepartment()
                            .getDepartmentId());


            lectureDtoList.add(lectureDto);
        }

        return lectureDtoList;
    }


    // GET LECTURE BY ID
    public LectureDto getLectureById(Long id)
            throws Exception {

        Lecture lecture = lectureRepository
                .findById(id)
                .orElseThrow(() ->
                        new Exception("Lecture Not Found"));


        LectureDto lectureDto =
                new LectureDto();

        lectureDto.setLectureId(
                lecture.getLectureId());

        lectureDto.setLectureDate(
                lecture.getLectureDate());

        lectureDto.setStartTime(
                lecture.getStartTime());

        lectureDto.setEndTime(
                lecture.getEndTime());

        lectureDto.setTopic(
                lecture.getTopic());

        lectureDto.setRoomNo(
                lecture.getRoomNo());

        lectureDto.setYear(
                lecture.getYear());

        lectureDto.setSemester(
                lecture.getSemester());

        lectureDto.setDivision(
                lecture.getDivision());

        lectureDto.setSubjectId(
                lecture.getSubject()
                        .getSubjectId());

        lectureDto.setProfessorId(
                lecture.getProfessor()
                        .getProfessorId());

        lectureDto.setDepartmentId(
                lecture.getDepartment()
                        .getDepartmentId());


        return lectureDto;
    }


    // UPDATE LECTURE
    public void updateLecture(Long id,
                              LectureDto lectureDto)
            throws Exception {

        Lecture lecture = lectureRepository
                .findById(id)
                .orElseThrow(() ->
                        new Exception("Lecture Not Found"));


        Subject subject = subjectRepository
                .findBySubjectIdAndActiveTrue(
                        lectureDto.getSubjectId())
                .orElseThrow(() ->
                        new Exception("Subject Not Found"));


        Professor professor = professorRepository
                .findByProfessorIdAndActiveTrue(
                        lectureDto.getProfessorId())
                .orElseThrow(() ->
                        new Exception("Professor Not Found"));


        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(
                        lectureDto.getDepartmentId())
                .orElseThrow(() ->
                        new Exception("Department Not Found"));


        lecture.setLectureDate(
                lectureDto.getLectureDate());

        lecture.setStartTime(
                lectureDto.getStartTime());

        lecture.setEndTime(
                lectureDto.getEndTime());

        lecture.setTopic(
                lectureDto.getTopic());

        lecture.setRoomNo(
                lectureDto.getRoomNo());

        lecture.setYear(
                lectureDto.getYear());

        lecture.setSemester(
                lectureDto.getSemester());

        lecture.setDivision(
                lectureDto.getDivision());

        lecture.setSubject(subject);
        lecture.setProfessor(professor);
        lecture.setDepartment(department);
        lectureRepository.save(lecture);
    }


    // DELETE LECTURE
    public void deleteLecture(Long id)
            throws Exception {

        Lecture lecture = lectureRepository
                .findById(id)
                .orElseThrow(() ->
                        new Exception("Lecture Not Found"));


        lectureRepository.delete(lecture);
    }
}
