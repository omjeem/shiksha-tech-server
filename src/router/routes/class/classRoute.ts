import express from "express"
import authMiddleware from "../../../middleware/authMiddleware"
import { ClassValidator } from "../../../validator/class/classValidators"
import { validateRequest } from "../../../middleware/zodValidator"
import { ClassController } from "../../../controllers/class/classController"

const classRouter = express.Router()
classRouter.use(authMiddleware)

classRouter.post("/", validateRequest(ClassValidator.createClass()), ClassController.createClass)

classRouter.get("/", validateRequest(ClassValidator.getALLClass()), ClassController.getAllClasses)


export default classRouter