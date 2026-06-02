package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;

    @Column(nullable = false)
    private String departmentName;

    @Column(unique = true, nullable = false)
    private String departmentCode;

    // Many Departments -> One College
    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    // One Department -> Many Students
    @OneToMany(mappedBy = "department")
    private List<Student> students;

    // One Department -> Many Professors
    @OneToMany(mappedBy = "department")
    private List<Professor> professors;

    // One Department -> Many Subjects
    @OneToMany(mappedBy = "department")
    private List<Subject> subjects;

    @Column(nullable = false)
    private Boolean active = true;
}
