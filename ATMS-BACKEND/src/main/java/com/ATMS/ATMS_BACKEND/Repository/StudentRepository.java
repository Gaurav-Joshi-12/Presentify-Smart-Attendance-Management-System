package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.College;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {
    public List<Student> findByActiveTrue();
    public Optional<Student> findByStudentIdAndActiveTrue(Long id);
    List<Student>
    findByYearAndSemesterAndDivisionAndDepartmentAndActiveTrue(
            Integer year,
            Integer semester,
            String division,
            Department department);
    List<Student> findByCollegeAndActiveTrue(
            College college);
}
