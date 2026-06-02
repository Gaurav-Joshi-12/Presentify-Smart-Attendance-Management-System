package com.ATMS.ATMS_BACKEND.Service;

import jakarta.persistence.Column;

import java.time.LocalDateTime;//    CLG
//    addCollege()
//    getAllColleges()
//    getCollegeById()
//    updateCollege()
//    deleteCollege()

//        Long collegeId;
//        private String collegeName;
//        @Column(unique = true, nullable = false)
//        private String collegeCode;
//        private String address;
//        private String city;
//        private String state;
//        private String pincode;
//        private String email;
//        private String phoneNo;
//        private LocalDateTime createdAt;


import com.ATMS.ATMS_BACKEND.DTO.CollegeDto;
import com.ATMS.ATMS_BACKEND.Models.College;
import com.ATMS.ATMS_BACKEND.Repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CollegeService {

    @Autowired
    CollegeRepository collegeRepository;

    public void addCollege(CollegeDto collegeDto){
        College college = new College();
        college.setCollegeCode(collegeDto.getCollegeCode());
        college.setCollegeName(collegeDto.getCollegeName());
        college.setAddress(collegeDto.getAddress());
        college.setCity(collegeDto.getCity());
        college.setEmail(collegeDto.getEmail());
        college.setState(collegeDto.getState());
        college.setPincode(collegeDto.getPincode());
        college.setPhoneNo(collegeDto.getPhoneNo());
        college.setCreatedAt(LocalDateTime.now());
        college.setActive(true);
        collegeRepository.save(college);
    }

    public List<CollegeDto > getAllColleges(){
        List<College> collegeList = collegeRepository.findByActiveTrue();
        List<CollegeDto> collegeDtoList = new ArrayList<>();
        for(College college:collegeList){
            CollegeDto collegeDto = new CollegeDto();
            collegeDtoList.add(collegeDto.convertToDto(college));
        }
        if(!collegeDtoList.isEmpty()) return collegeDtoList;
        else return null;
    }

    public CollegeDto getCollegeById(Long id) throws Exception{
        College college = collegeRepository.findByCollegeIdAndActiveTrue(id).orElseThrow(()->{
            throw new RuntimeException("College not found");
        });
        CollegeDto collegeDto = new CollegeDto();
//        collegeDto.setCollegeCode(college.getCollegeCode());
//        collegeDto.setCollegeName(college.getCollegeName());
//        collegeDto.setAddress(college.getAddress());
//        collegeDto.setCity(college.getCity());
//        collegeDto.setEmail(college.getEmail());
//        collegeDto.setState(college.getState());
//        collegeDto.setPincode(college.getPincode());
//        collegeDto.setPhoneNo(college.getPhoneNo());
        return collegeDto.convertToDto(college);

    }

    public void updateClg(Long id,CollegeDto collegeDto)throws Exception{
        College college = collegeRepository.findByCollegeIdAndActiveTrue(id).orElseThrow(()->new Exception("College Does Not exist to update"));
        college.setCollegeCode(collegeDto.getCollegeCode());
        college.setCollegeName(collegeDto.getCollegeName());
        college.setAddress(collegeDto.getAddress());
        college.setCity(collegeDto.getCity());
        college.setEmail(collegeDto.getEmail());
        college.setState(collegeDto.getState());
        college.setPincode(collegeDto.getPincode());
        college.setPhoneNo(collegeDto.getPhoneNo());
        college.setUpdatedAt(LocalDateTime.now());
        collegeRepository.save(college);

    }

    public void deleteClg(Long id) throws Exception{
        College college = collegeRepository.findById(id).orElseThrow(()->new Exception("College Does Not exist to update"));
        college.setActive(false);
        college.setUpdatedAt(LocalDateTime.now());
        collegeRepository.save(college);
    }

}
