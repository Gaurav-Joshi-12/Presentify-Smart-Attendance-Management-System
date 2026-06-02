package com.ATMS.ATMS_BACKEND.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class LectureDto {

    private Long lectureId;
    private LocalDate lectureDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String topic;
    private String roomNo;
    private Integer year;
    private Integer semester;
    private String division;

    // Subj lec belongs to
    private Long subjectId;

    // prof taking that lec
    private Long professorId;

    // dept that lec belongs to
    private Long departmentId;

}