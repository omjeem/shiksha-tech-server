import { Request, Response } from 'express';
import { CustomRequest } from '../../utils/interfaces';
import { StudentDBServices } from '../../dbServices/student/StudentDBServices';
import { errorResponse, successResponse } from '../../config/response';
import { SchoolDBServices } from '../../dbServices/school/SchoolDBServices';
import { AddStudentBodyType } from '../../config/zodTypes';
import { ClassDBServices } from '../../dbServices/class/ClassDBServices';
import { SectionDBServices } from '../../dbServices/section/SectionDBServices';

export class StudentController {
  static addStudent: any = async (req: CustomRequest, res: Response) => {
    try {
      const body: AddStudentBodyType = req.body;
      const schoolId = req.user.schoolId;  
      const classId: string = body.classId;
      const sectionId: string | undefined = body.sectionId;
      const studentData = body.studentData;

      await SchoolDBServices.isSchoolExists(schoolId);
      await ClassDBServices.isClassExists(classId);
      await SectionDBServices.isSectionExists(sectionId);
  

      const duplicateSrNo : number[] = []
      const duplicateEmail : string[] = []
      const registeredStudentDataSr = new Set<number>();
      const registeredStudentDataEmail = new Set<string>();


      const studentDataWithSrNoAndEmail = await StudentDBServices.getAllSrAndEmail(schoolId, classId);

      studentDataWithSrNoAndEmail.forEach((student) => {
        registeredStudentDataSr.add(student.srNo);
        registeredStudentDataEmail.add(student.email);
      });

      studentData.forEach((student) => {
        if (registeredStudentDataSr.has(student.srNo)) {
          duplicateSrNo.push(student.srNo);
        }
        if (registeredStudentDataEmail.has(student.email)) {
          duplicateEmail.push(student.email);
        }
      });

      if (duplicateSrNo.length > 0) {
        return errorResponse(res, 400, `These Sr No Already registered ${duplicateSrNo}`);
      }
      if (duplicateEmail.length > 0) {
        return errorResponse(res, 400, `These Email Are Already Registered ${duplicateEmail}`);
      }

      studentData.map(student => {

        const emailHeader = student.email.split('@')[0];
        const password = `${emailHeader}${student.srNo}`;

        student.schoolId = schoolId;
        student.classId = classId;
        student.sectionId = sectionId;
        student.password = password;
      })


      const data = await StudentDBServices.createStudent(studentData);
      return successResponse(res, 200, 'Student created successfully', data);
    } catch (Err) {
      console.log('Error while creating the student', Err);
      return errorResponse(res, 400, Err);
    }
  };

  static getAllStudents: any = async (req: CustomRequest, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      await SchoolDBServices.isSchoolExists(schoolId);
      const data = await StudentDBServices.getAllStudents(schoolId);
      return successResponse(res, 200, 'Students fetched successfully', data);
    } catch (Err) {
      console.log('Error in getting students ', Err);
      return errorResponse(res, 400, Err);
    }
  };
}
