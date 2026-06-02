package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity                         // Tells JPA that this class is a database table
@Table(name = "student")       // Table name in DB will be "student"

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Student {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;


    @Column(unique = true, nullable = false)
    private String rollNo;


    @Column(nullable = false)
    private String firstName;

    private String lastName;


    @Column(unique = true, nullable = false)
    private String email;


    @Column(nullable = false)
    private String password;

    private String phoneNo;

    private String gender;

    private LocalDate dob;

    private Integer year;

    private Integer semester;

    private String division;

    private LocalDate admissionDate;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean active = true;


    // Many Students belong to ONE College
    // So student table gets college_id foreign key
    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;



    // Many Students belong to ONE Department
    // So student table gets department_id foreign key
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;



    // Many Students can study Many Subjects
    // Example:
    // Rahul studies DBMS + OS
    // Priya studies DBMS + CN
    // So JPA creates separate join table:
    // student_subject
    // student_id | subject_id
    //
    // 1          | 101
    // 1          | 102
    // 2          | 101

    @ManyToMany

    @JoinTable(

            // Name of middle table
            name = "student_subject",

            // Current entity foreign key
            // Since this entity is Student
            // column will be student_id
            joinColumns = @JoinColumn(name = "student_id"),

            // Opposite entity foreign key
            // Since opposite entity is Subject
            // column will be subject_id
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )

    private List<Subject> subjects;

    // One Student can have many attendance records
    // Example:
    // Rahul attended many lectures
    @OneToMany(mappedBy = "student")
    private List<Attendance> attendanceRecords;

}