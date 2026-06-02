package com.ATMS.ATMS_BACKEND.DTO;

import com.ATMS.ATMS_BACKEND.Enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AttendanceDto {

    // PRESENT / ABSENT / LATE / LEAVE
    private AttendanceStatus attendanceStatus;

    // Optional remarks
    private String remarks;

    // Which lecture this attendance belongs to
    private Long lectureId;

    // Which student's attendance is being marked
    private Long studentId;

}