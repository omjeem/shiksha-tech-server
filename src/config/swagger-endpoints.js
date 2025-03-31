/**
 * This file collects all the Swagger documentation from controller response functions.
 * It imports response function definitions from controllers and makes them available for the Swagger generator.
 */

const { createSchoolResponse } = require('../controllers/school/controllers/createSchool');
const { superAdminLoginResponse } = require('../controllers/superAdmin/controllers/login');
const { getSchoolDetailsResponse } = require('../controllers/school/controllers/getDetails');

module.exports = {
  createSchool: createSchoolResponse(),
  superAdminLogin: superAdminLoginResponse(),
  schoolDetail: getSchoolDetailsResponse()
}; 