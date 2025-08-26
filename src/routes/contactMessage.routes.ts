import express from "express";
import { submitContactMessageForm } from "../controllers/contactMessageController";

const router = express.Router();

router.post("/submit", submitContactMessageForm);

export default router;
