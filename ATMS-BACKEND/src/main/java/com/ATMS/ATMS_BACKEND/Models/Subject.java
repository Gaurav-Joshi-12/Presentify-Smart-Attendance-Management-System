package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "subject")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;

    @Column(nullable = false)
    private String subjectName;

    @Column(unique = true, nullable = false)
    private String subjectCode;

    private Integer credits;
    private Integer semester;

    @Column(nullable = false)
    private Boolean active = true;

    // Many Subjects -> One Department
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // Many Subjects <-> Many Students
    @ManyToMany(mappedBy = "subjects")
    private List<Student> students;

    // Many Subjects <-> Many Professors
    @ManyToMany(mappedBy = "subjects")
    private List<Professor> professors;

    // One Subject -> Many Lectures
    @OneToMany(mappedBy = "subject")
    private List<Lecture> lectures;

}