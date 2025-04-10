import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { CustomRequest } from "../../utils/interfaces";
import { SectionDBServices } from "../../dbServices/section/SectionDBServices";

export class SectionController {
    static createSection: any = async (req: CustomRequest, res: Response) => {
        try {
            const body = req.body;
            const schoolId = req.user.schoolId;
            if (!schoolId) {
                return errorResponse(res, 400, 'School Id not found');
            }
            const data = await SectionDBServices.createSection(body, schoolId);
            return successResponse(res, 200, 'Section created successfully', data);
        } catch (Err) {
            console.log("Error in creating section ", Err);
            return errorResponse(res, 400, Err)
        }
    }

    static getAllSections : any = async (req: CustomRequest, res: Response)=>{
        try{
            const schoolId = req.user.schoolId;
            const classId = req.params.classId
            if(!schoolId){
                return errorResponse(res, 400, 'School Id not found')
            }
            const data = await SectionDBServices.getAllSections(schoolId, classId);
            return successResponse(res, 200, 'Sections fetched successfully', data);
        }catch(Err){
            console.log("Error in getting sections ", Err);
            return errorResponse(res, 400, Err)
        }
    }
}