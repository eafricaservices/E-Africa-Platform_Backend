import { Router } from "express";
import { submitDiscoveryForm } from "../controllers/discoveryController";

const router = Router();

router.post("/submit", submitDiscoveryForm);

export default router;
