package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.Models.AttendanceEvent;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {
    @Value("${twilio.account.sid}")
    private String SID;

    @Value("${twilio.auth.token}")
    private String TOKEN;

    @Value("${twilio.phone.number}")
    private String FROM_NUMBER;

    public void sendWhatsappMessage(AttendanceEvent attendanceEvent){
        Twilio.init(SID,TOKEN);
        Message message = Message.creator(new PhoneNumber("whatsapp:+91"+attendanceEvent.getPhoneNumber()),new PhoneNumber("whatsapp:"+FROM_NUMBER),"\nStudent Name: "+attendanceEvent.getStudentName()+"\nProfessor Name:"+attendanceEvent.getTeacherName()+"\nDate: "+attendanceEvent.getDate()+"\nSubject:"+attendanceEvent.getSubjectName()+"\nTopic:"+attendanceEvent.getSubjectTopic()+"\nAttendance Status: "+attendanceEvent.getAttendanceStatus()+"\nRemark: "+attendanceEvent.getStudentRemark()).create();
    }
}
