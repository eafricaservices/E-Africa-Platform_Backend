import express from "express";
import userRoutes from "./user.routes";
import companyRoutes from "./company.routes";
import messageRoutes from "./message.routes";
import trainingRoutes from "./training.routes";
import discoveryRoutes from "./discovery.routes";
import talentPoolRoutes from "./talentPool.routes";
import contactMessageRoutes from "./contactMessage.routes";
import authRoutes from "./auth.routes";
import verificationRoutes from "./verification.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/verification", verificationRoutes);
router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/messages", messageRoutes);
router.use("/trainings", trainingRoutes);
router.use("/discovery", discoveryRoutes);
router.use("/talent-pool", talentPoolRoutes);
router.use("/contact-message", contactMessageRoutes);



export default router;
