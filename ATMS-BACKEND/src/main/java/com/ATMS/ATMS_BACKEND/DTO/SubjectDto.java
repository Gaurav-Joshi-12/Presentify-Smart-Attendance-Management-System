package com.ATMS.ATMS_BACKEND.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class SubjectDto {

    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Integer credits;
    private Integer semester;

    // Which department this subject belongs to
    private Long departmentId;

}