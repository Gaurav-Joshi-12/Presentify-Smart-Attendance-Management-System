package com.ATMS.ATMS_BACKEND.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class StudentDto {

    private Long studentId;
    private String rollNo;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNo;
    private String gender;
    private LocalDate dob;
    private Integer year;
    private Integer semester;
    private String division;
    private LocalDate admissionDate;

    // Which college student belongs to
    private Long collegeId;

    // Which department student belongs to
    private Long departmentId;

}