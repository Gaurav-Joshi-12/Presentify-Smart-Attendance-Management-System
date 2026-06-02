package com.ATMS.ATMS_BACKEND.Models;

import com.ATMS.ATMS_BACKEND.Enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceEvent {
    private String studentName;
    private String phoneNumber;
    private String subjectName;
    private String subjectTopic;
    private LocalDateTime date;
    private AttendanceStatus attendanceStatus;
    private String teacherName;
    private String studentRemark;
}
