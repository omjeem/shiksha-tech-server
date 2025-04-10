import express from "express"
import authMiddleware from "../../../middleware/authMiddleware";
import { SectionController } from "../../../controllers/section/SectionController";
import { validateRequest } from "../../../middleware/zodValidator";
import { SectionValidator } from "../../../validator/section/sectionValidator";

const sectionRouter = express.Router();
sectionRouter.use(authMiddleware);

sectionRouter.post("/", validateRequest(SectionValidator.createSection()), SectionController.createSection)

sectionRouter.get("/:classId", validateRequest(SectionValidator.getAllSections()), SectionController.getAllSections)

export default sectionRouter;