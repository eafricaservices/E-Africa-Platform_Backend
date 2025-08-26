import { Router } from "express";
import { submitTrainingForm } from "../controllers/trainingController";

const router = Router();

router.post("/submit", submitTrainingForm);

export default router;
