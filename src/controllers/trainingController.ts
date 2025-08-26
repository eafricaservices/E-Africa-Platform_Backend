import { Request, Response } from "express";
import { validateTrainingForm } from "../helpers/validateTrainingForm";
import User from "../model/user";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const submitTrainingForm = async (req: Request, res: Response) => {
  const validationResult = validateTrainingForm(req.body);
  logValidation(req, validationResult, 'submitTrainingForm');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const user = await User.create(req.body);
    logDatabaseOperation(req, 'User.create (training)', 'success', user);
    return res.status(201).json({ message: "Training form submitted successfully", user });
  } catch (err) {
    logDatabaseOperation(req, 'User.create (training)', 'error', null, err);
    return res.status(500).json({ message: "Failed to save training form", error: err });
  }
};