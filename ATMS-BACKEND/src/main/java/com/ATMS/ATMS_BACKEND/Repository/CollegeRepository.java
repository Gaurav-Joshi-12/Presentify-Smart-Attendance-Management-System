package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College,Long> {
    public List<College> findByActiveTrue();
    Optional<College> findByCollegeIdAndActiveTrue(Long id);

}
