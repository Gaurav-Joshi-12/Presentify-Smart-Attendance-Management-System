package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "professor")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long professorId;

    @Column(nullable = false)
    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phoneNo;

    @Column(unique = true, nullable = false)
    private String employeeId;

    private String designation;
    private LocalDate joiningDate;
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean active = true;

    // Many Professors -> One College
    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    // Many Professors -> One Department
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // Many Professors <-> Many Subjects
    @ManyToMany
    @JoinTable(
            name = "professor_subject",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> subjects;

    // One Professor -> Many Lectures
    @OneToMany(mappedBy = "professor")
    private List<Lecture> lectures;

}