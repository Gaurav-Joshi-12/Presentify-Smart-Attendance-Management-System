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

public class ProfessorDto {

    private Long professorId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNo;
    private String designation;
    private LocalDate joiningDate;

    // prof belongs to which clg
    private Long collegeId;

    // prof belongs to which dept
    private Long departmentId;

}