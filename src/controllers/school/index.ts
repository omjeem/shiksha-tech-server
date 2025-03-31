import { createSchoolController } from './controllers/createSchool';
import { getDetailsController } from './controllers/getDetails';

class SchoolController {
  static CreateSchool = createSchoolController;
  static GetDetails = getDetailsController;
}

export default SchoolController;
