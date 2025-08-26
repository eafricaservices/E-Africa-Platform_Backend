import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { swaggerSpec, swaggerUi } from "./config/swagger";
import routers from "./routes";
import passport from "./config/passport";
import logger from "./config/logger";
import config, { validateConfig } from "./config/config";
import { requestLogger } from "./middleware/logging";

// Validate environment configuration
try {
    validateConfig();
} catch (error) {
    logger.error('Configuration validation failed', {
        error: error instanceof Error ? error.message : error
    });
    process.exit(1);
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger); // Add logging middleware
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.get("/", (_req, res) => res.send("Welcome to E-Africa Landing Page API"));
app.use("/api", routers);


const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
        port: PORT,
        environment: config.nodeEnv
    });
});
