import { Request, Response } from "express";
import Company from "../model/companies";
import validateCompanyForm from "../helpers/validateCompanyForm";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const createCompany = async (req: Request, res: Response) => {
  const validationResult = validateCompanyForm(req.body);
  logValidation(req, validationResult, 'createCompany');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const company = await Company.create(req.body);
    logDatabaseOperation(req, 'Company.create', 'success', company);
    return res.status(201).json(company);
  } catch (err) {
    logDatabaseOperation(req, 'Company.create', 'error', null, err);
    return res.status(400).json({ message: "Failed to create company", error: err });
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    logDatabaseOperation(req, 'Company.find', 'success', companies);
    return res.json(companies);
  } catch (err) {
    logDatabaseOperation(req, 'Company.find', 'error', null, err);
    return res.status(500).json({ message: "Failed to fetch companies", error: err });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ companyId: req.params.id });
    if (!company) {
      logDatabaseOperation(req, 'Company.findOne', 'error', null, 'Company not found');
      return res.status(404).json({ message: "Company not found" });
    }
    logDatabaseOperation(req, 'Company.findOne', 'success', company);
    return res.json(company);
  } catch (err) {
    logDatabaseOperation(req, 'Company.findOne', 'error', null, err);
    return res.status(500).json({ message: "Error fetching company", error: err });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const validationResult = validateCompanyForm(req.body);
  logValidation(req, validationResult, 'updateCompany');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const company = await Company.findOneAndUpdate(
      { companyId: req.params.id },
      req.body,
      { new: true }
    );
    if (!company) {
      logDatabaseOperation(req, 'Company.findOneAndUpdate', 'error', null, 'Company not found');
      return res.status(404).json({ message: "Company not found" });
    }
    logDatabaseOperation(req, 'Company.findOneAndUpdate', 'success', company);
    return res.json(company);
  } catch (err) {
    logDatabaseOperation(req, 'Company.findOneAndUpdate', 'error', null, err);
    return res.status(400).json({ message: "Failed to update company", error: err });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOneAndDelete({ companyId: req.params.id });
    if (!company) {
      logDatabaseOperation(req, 'Company.findOneAndDelete', 'error', null, 'Company not found');
      return res.status(404).json({ message: "Company not found" });
    }
    logDatabaseOperation(req, 'Company.findOneAndDelete', 'success', { companyId: req.params.id });
    return res.json({ message: "Company deleted" });
  } catch (err) {
    logDatabaseOperation(req, 'Company.findOneAndDelete', 'error', null, err);
    return res.status(500).json({ message: "Failed to delete company", error: err });
  }
};
