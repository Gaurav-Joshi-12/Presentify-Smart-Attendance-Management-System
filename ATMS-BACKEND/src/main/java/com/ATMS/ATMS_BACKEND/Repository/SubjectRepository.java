package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject,Long> {
    public List<Subject> findByActiveTrue();
    Optional<Subject> findBySubjectIdAndActiveTrue(Long id);
    List<Subject> findByDepartmentAndSemesterAndActiveTrue(
            Department department,
            Integer semester);
}
