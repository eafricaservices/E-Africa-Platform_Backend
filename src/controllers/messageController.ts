import { Request, Response } from "express";
import Message from "../model/message";
import validateMessageForm from "../helpers/validateMessageForm";
import { logValidation, logDatabaseOperation } from "../middleware/logging";

export const createMessage = async (req: Request, res: Response) => {
  const validationResult = validateMessageForm(req.body);
  logValidation(req, validationResult, 'createMessage');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const message = await Message.create(req.body);
    logDatabaseOperation(req, 'Message.create', 'success', message);
    return res.status(201).json(message);
  } catch (err) {
    logDatabaseOperation(req, 'Message.create', 'error', null, err);
    return res.status(400).json({ message: "Failed to create message", error: err });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    logDatabaseOperation(req, 'Message.find', 'success', messages);
    return res.json(messages);
  } catch (err) {
    logDatabaseOperation(req, 'Message.find', 'error', null, err);
    return res.status(500).json({ message: "Failed to fetch messages", error: err });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const message = await Message.findOne({ messageId: req.params.id });
    if (!message) {
      logDatabaseOperation(req, 'Message.findOne', 'error', null, 'Message not found');
      return res.status(404).json({ message: "Message not found" });
    }
    logDatabaseOperation(req, 'Message.findOne', 'success', message);
    return res.json(message);
  } catch (err) {
    logDatabaseOperation(req, 'Message.findOne', 'error', null, err);
    return res.status(500).json({ message: "Error fetching message", error: err });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  const validationResult = validateMessageForm(req.body);
  logValidation(req, validationResult, 'updateMessage');

  if (!validationResult.isValid) {
    return res.status(400).json({ errors: validationResult.errors });
  }

  try {
    const message = await Message.findOneAndUpdate(
      { messageId: req.params.id },
      req.body,
      { new: true }
    );
    if (!message) {
      logDatabaseOperation(req, 'Message.findOneAndUpdate', 'error', null, 'Message not found');
      return res.status(404).json({ message: "Message not found" });
    }
    logDatabaseOperation(req, 'Message.findOneAndUpdate', 'success', message);
    return res.json(message);
  } catch (err) {
    logDatabaseOperation(req, 'Message.findOneAndUpdate', 'error', null, err);
    return res.status(400).json({ message: "Failed to update message", error: err });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findOneAndDelete({ messageId: req.params.id });
    if (!message) {
      logDatabaseOperation(req, 'Message.findOneAndDelete', 'error', null, 'Message not found');
      return res.status(404).json({ message: "Message not found" });
    }
    logDatabaseOperation(req, 'Message.findOneAndDelete', 'success', { messageId: req.params.id });
    return res.json({ message: "Message deleted" });
  } catch (err) {
    logDatabaseOperation(req, 'Message.findOneAndDelete', 'error', null, err);
    return res.status(500).json({ message: "Failed to delete message", error: err });
  }
};
