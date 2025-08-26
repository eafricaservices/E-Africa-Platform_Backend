import { WorkPreference, workPreferenceOptions } from "../model/types";

interface TalentPoolFormData {
    fullName: string;
    email: string;
    country: string;
    linkedIn?: string;
    preference?: WorkPreference;
    desiredRole?: string;
    cvUrl?: string;
}

interface ValidationResult {
    errors: Partial<Record<keyof TalentPoolFormData, string>>;
    isValid: boolean;
}

const isEmpty = (value: any) =>
    value === undefined || value === null || value.toString().trim() === "";

function validateTalentPoolForm(data: Partial<TalentPoolFormData>): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    if (isEmpty(data.fullName) || data.fullName!.trim().length < 2) {
        errors.fullName = "Full Name is required and must be at least 2 characters.";
    }
    if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email!)) {
        errors.email = "A valid Email Address is required.";
    }
    if (isEmpty(data.country) || data.country!.trim().length < 2) {
        errors.country = "Country is required.";
    }
    if (isEmpty(data.preference) || !workPreferenceOptions.includes(data.preference!)) {
        errors.preference = `Preference must be one of: ${workPreferenceOptions.join(", ")}.`;
    }
    // LinkedIn, desiredRole, cvUrl are optional but can be validated for format if needed

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateTalentPoolForm;
