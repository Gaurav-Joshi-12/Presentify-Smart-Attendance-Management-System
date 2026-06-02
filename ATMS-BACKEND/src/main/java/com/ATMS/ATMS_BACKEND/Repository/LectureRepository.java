package com.ATMS.ATMS_BACKEND.Repository;

import com.ATMS.ATMS_BACKEND.Models.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureRepository extends JpaRepository<Lecture,Long> {
}
