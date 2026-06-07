package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.Attendance;
import com.ATMS.ATMS_BACKEND.Models.Lecture;
import com.ATMS.ATMS_BACKEND.Models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    List<Attendance> findByLecture(Lecture lecture);
    List<Attendance> findByStudent(Student student);
    List<Attendance> findByLectureSubjectSubjectId(Long subjectId);
    List<Attendance> findByLectureAndStudent(Lecture lecture, Student student);
    List<Attendance> findByStudentAndLectureSubjectSubjectId(Student student, Long subjectId);

}
