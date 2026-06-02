package com.ATMS.ATMS_BACKEND.Models;

import com.ATMS.ATMS_BACKEND.Enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity                                  // Makes this class a DB table
@Table(name = "attendance")             // Table name will be attendance

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Attendance {

    // Primary key of attendance table
    @Id

    // Auto increment ID
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    // EnumType.STRING stores actual text in DB -> Present,absent,late etc
    // instead of numbers like 0,1,2
    @Enumerated(EnumType.STRING)

    @Column(nullable = false)
    private AttendanceStatus attendanceStatus;

    // Stores time when attendance was marked
    private LocalDateTime markedAt;

    // Optional remarks
    // Example:
    // "Medical Leave"
    // "Late due to traffic"
    private String remarks;

    // Many Attendance records belong to ONE Lecture
    // Example:
    // Lecture 15 has attendance of many students
    // Creates lecture_id foreign key in attendance table
    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    // Many Attendance records belong to ONE Student
    // Example:
    // Rahul has many attendance records
    // Creates student_id foreign key in attendance table
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

}