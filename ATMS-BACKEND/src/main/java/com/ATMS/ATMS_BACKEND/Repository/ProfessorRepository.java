package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor,Long> {
    Optional<Professor> findByProfessorIdAndActiveTrue(Long id);
    public List<Professor> findByActiveTrue();
}
