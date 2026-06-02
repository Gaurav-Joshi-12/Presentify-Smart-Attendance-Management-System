package com.ATMS.ATMS_BACKEND.Service;

import com.ATMS.ATMS_BACKEND.DTO.DepartmentDto;
import com.ATMS.ATMS_BACKEND.Models.College;
import com.ATMS.ATMS_BACKEND.Models.Department;
import com.ATMS.ATMS_BACKEND.Repository.CollegeRepository;
import com.ATMS.ATMS_BACKEND.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    CollegeRepository collegeRepository;



    // ADD DEPARTMENT
    public void addDepartment(DepartmentDto departmentDto) throws Exception {

        // Find college using collegeId from DTO
        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(departmentDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        // Create Department object
        Department department = new Department();

        department.setDepartmentCode(departmentDto.getDepartmentCode());

        department.setDepartmentName(departmentDto.getDepartmentName());

        department.setCollege(college);

        department.setActive(true);



        // Save department
        departmentRepository.save(department);
    }



    // GET ALL DEPARTMENTS
    public List<DepartmentDto> getAllDepartments() {

        List<Department> departmentList =
                departmentRepository.findByActiveTrue();

        List<DepartmentDto> departmentDtoList =
                new ArrayList<>();



        for (Department department : departmentList) {
            DepartmentDto departmentDto = new DepartmentDto();
            departmentDto.setDepartmentId(department.getDepartmentId());
            departmentDto.setDepartmentCode(department.getDepartmentCode());

            departmentDto.setDepartmentName(
                    department.getDepartmentName());



            // Sending collegeId in DTO
            departmentDto.setCollegeId(
                    department.getCollege().getCollegeId());

            departmentDtoList.add(departmentDto);
        }

        return departmentDtoList;
    }



    // GET DEPARTMENT BY ID
    public DepartmentDto getDepartmentById(Long id)
            throws Exception {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        DepartmentDto departmentDto = new DepartmentDto();
        departmentDto.setDepartmentId(department.getDepartmentId());
        departmentDto.setDepartmentCode(
                department.getDepartmentCode());

        departmentDto.setDepartmentName(
                department.getDepartmentName());

        departmentDto.setCollegeId(
                department.getCollege().getCollegeId());



        return departmentDto;
    }



    // UPDATE DEPARTMENT
    public void updateDepartment(Long id,
                                 DepartmentDto departmentDto)
            throws Exception {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        // Find updated college
        College college = collegeRepository
                .findByCollegeIdAndActiveTrue(
                        departmentDto.getCollegeId())
                .orElseThrow(() ->
                        new Exception("College Not Found"));



        department.setDepartmentCode(
                departmentDto.getDepartmentCode());

        department.setDepartmentName(
                departmentDto.getDepartmentName());

        department.setCollege(college);



        departmentRepository.save(department);
    }



    // SOFT DELETE DEPARTMENT
    public void deleteDepartment(Long id)
            throws Exception {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new Exception("Department Not Found"));



        department.setActive(false);

        departmentRepository.save(department);
    }
}
