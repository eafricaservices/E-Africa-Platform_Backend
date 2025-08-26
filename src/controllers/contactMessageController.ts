import { Request, Response } from "express";
import Message from "../model/message";
import validateContactMessageForm from "../helpers/validateContactMessageForm";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const submitContactMessageForm = async (req: Request, res: Response) => {
    const validationResult = validateContactMessageForm(req.body);
    logValidation(req, validationResult, 'submitContactMessageForm');

    if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
    }

    try {
        const message = await Message.create(req.body);
        logDatabaseOperation(req, 'Message.create (contact)', 'success', message);
        return res.status(201).json({ message: "Contact message submitted successfully" });
    } catch (err) {
        logDatabaseOperation(req, 'Message.create (contact)', 'error', null, err);
        return res.status(500).json({ message: "Failed to save contact message", error: err });
    }
};
