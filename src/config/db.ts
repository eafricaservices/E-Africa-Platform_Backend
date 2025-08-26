import mongoose from "mongoose";
import logger from "./logger";
import config from "./config";

const connectDB = async () => {
  if (!config.mongoUri) {
    logger.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error("MongoDB connection error", { error: err instanceof Error ? err.message : err });
    process.exit(1);
  }
};

export default connectDB;
