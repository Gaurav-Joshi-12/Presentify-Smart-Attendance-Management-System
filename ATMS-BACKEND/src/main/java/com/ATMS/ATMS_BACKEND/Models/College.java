package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "college")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long collegeId;

    @Column(nullable = false)
    private String collegeName;

    @Column(unique = true, nullable = false)
    private String collegeCode;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private String email;
    private String phoneNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;

    // One College -> Many Departments
    @OneToMany(mappedBy = "college")
    private List<Department> departments;

    // One College -> Many Students
    @OneToMany(mappedBy = "college")
    private List<Student> students;

    // One College -> Many Professors
    @OneToMany(mappedBy = "college")
    private List<Professor> professors;

}