package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.Models.AttendanceEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;


@Service
public class AttendanceProducerService {
    public final String TOPIC = "Notifications";
    @Autowired
    KafkaTemplate<String,String> kafkaTemplate;

    @Autowired
    ObjectMapper objectMapper;


    public void publish(AttendanceEvent attendanceEvent){

        String jsonPayload = objectMapper.writeValueAsString(attendanceEvent);
        System.out.println("kafka prod - > publishing event to topic : ["+TOPIC+"]: "+jsonPayload);
        kafkaTemplate.send(TOPIC,jsonPayload);
    }
}
