package com.ATMS.ATMS_BACKEND.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "lecture")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureId;

    @Column(nullable = false)
    private LocalDate lectureDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private String division;

    private String topic;

    private String roomNo;

    private LocalDateTime createdAt;

    // Many Lectures -> One Subject
    @ManyToOne
    @JoinColumn(name = "subject_id",nullable = false)
    private Subject subject;

    // Many Lectures -> One Professor
    @ManyToOne
    @JoinColumn(name = "professor_id",nullable = false)
    private Professor professor;

    // Many Lectures -> One Department
    @ManyToOne
    @JoinColumn(name = "department_id",nullable = false)
    private Department department;

    // One Lecture -> Many Attendance Records
    @OneToMany(mappedBy = "lecture")
    private List<Attendance> attendanceList;

}