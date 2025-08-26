import { IMessage } from "../model/message";

interface ValidationResult {
    errors: Partial<Record<keyof IMessage, string>>;
    isValid: boolean;
}

const isEmpty = (value: any) =>
    value === undefined || value === null || value.toString().trim() === "";

function validateMessageForm(data: Partial<IMessage>): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    if (isEmpty(data.fullName) || data.fullName!.trim().length < 2) {
        errors.fullName = "Full Name is required and must be at least 2 characters.";
    }
    if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email!)) {
        errors.email = "A valid Email Address is required.";
    }
    if (isEmpty(data.phone) || !/^\+?\d{7,}$/.test(data.phone!)) {
    errors.phone = "Phone is required and must be at least 7 digits (can start with +).";
    }

    if (isEmpty(data.message) || data.message!.trim().length < 5) {
        errors.message = "Message is required and must be at least 5 characters.";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateMessageForm;
