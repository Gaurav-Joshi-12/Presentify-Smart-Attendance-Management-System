package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.Models.AttendanceEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class AttendanceConsumerService {
    @Autowired
    WhatsappService whatsappService;

    @Autowired
    ObjectMapper objectMapper;



    @KafkaListener(topics = "Notifications",groupId = "coaching-attendance-group")
    public void consume(String json){
        AttendanceEvent attendanceEvent = objectMapper.readValue(json, AttendanceEvent.class);
        System.out.println(attendanceEvent.getPhoneNumber());
        whatsappService.sendWhatsappMessage(attendanceEvent);
    }


}
