import express from "express";
import { submitTalentPoolForm } from "../controllers/talentPoolController";

const router = express.Router();

router.post("/submit", submitTalentPoolForm);

export default router;
