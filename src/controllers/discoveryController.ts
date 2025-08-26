import { Request, Response } from "express";
import validateDiscoveryForm from "../helpers/validateDiscoveryForm";
import Company from "../model/companies";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const submitDiscoveryForm = async (req: Request, res: Response) => {
  const validationResult = validateDiscoveryForm(req.body);
  logValidation(req, validationResult, 'submitDiscoveryForm');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const company = await Company.create(req.body);
    logDatabaseOperation(req, 'Company.create', 'success', company);
    return res.status(201).json({ message: "Discovery form submitted successfully", company });
  } catch (err) {
    logDatabaseOperation(req, 'Company.create', 'error', null, err);
    return res.status(500).json({ message: "Failed to save discovery form", error: err });
  }
};
