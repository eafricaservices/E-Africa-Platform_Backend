import { ICompany } from "../model/companies";

interface ValidationResult {
    errors: Partial<Record<keyof ICompany, string>>;
    isValid: boolean;
}

const isEmpty = (value: any) =>
    value === undefined || value === null || value.toString().trim() === "";

function validateCompanyForm(data: Partial<ICompany>): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    if (isEmpty(data.companyName) || data.companyName!.trim().length < 2) {
        errors.companyName = "Company Name is required and must be at least 2 characters.";
    }
    if (isEmpty(data.industry) || data.industry!.trim().length < 2) {
        errors.industry = "Industry is required.";
    }
    if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email!)) {
        errors.email = "A valid Email Address is required.";
    }
    if (isEmpty(data.phone) || !/^\d{7,}$/.test(data.phone!)) {
        errors.phone = "Phone Number must be at least 10 digits.";
    }
    // Add more field validations as needed

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateCompanyForm;
