package com.ATMS.ATMS_BACKEND.DTO;

import com.ATMS.ATMS_BACKEND.Models.College;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CollegeDto {

    private Long collegeId;
    private String collegeName;
    private String collegeCode;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String email;
    private String phoneNo;

    public CollegeDto convertToDto(College college){
        CollegeDto collegeDto = new CollegeDto();
        collegeDto.setCollegeId(college.getCollegeId());
        collegeDto.setCollegeCode(college.getCollegeCode());
        collegeDto.setCollegeName(college.getCollegeName());
        collegeDto.setAddress(college.getAddress());
        collegeDto.setCity(college.getCity());
        collegeDto.setEmail(college.getEmail());
        collegeDto.setState(college.getState());
        collegeDto.setPincode(college.getPincode());
        collegeDto.setPhoneNo(college.getPhoneNo());
        return collegeDto;
    }

}