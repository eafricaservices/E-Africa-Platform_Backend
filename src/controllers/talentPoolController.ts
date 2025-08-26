import { Request, Response } from "express";
import User from "../model/user";
import validateTalentPoolForm from "../helpers/validateTalentPoolForm";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const submitTalentPoolForm = async (req: Request, res: Response) => {
    const validationResult = validateTalentPoolForm(req.body);
    logValidation(req, validationResult, 'submitTalentPoolForm');

    if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
    }

    try {
        const user = await User.create({
            ...req.body,
            role: "talent"
        });
        logDatabaseOperation(req, 'User.create (talent)', 'success', user);
        return res.status(201).json({ message: "Talent pool form submitted successfully", user });
    } catch (err) {
        logDatabaseOperation(req, 'User.create (talent)', 'error', null, err);
        return res.status(500).json({ message: "Failed to save talent pool form", error: err });
    }
};
