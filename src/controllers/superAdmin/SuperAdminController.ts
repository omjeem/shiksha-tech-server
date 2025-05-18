import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import { generateToken } from '../../config/jwt';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';
import { SuperAdminDBServices } from '../../dbServices/superAdmin/SuperAdminDBServices';

export class SuperAdminController {}
