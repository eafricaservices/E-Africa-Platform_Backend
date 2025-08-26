interface DiscoveryFormData {
    fullName: string;
    companyName: string;
    industry: string;
    email: string;
    phone: string;
    areaOfInterest: "Training" | "Hiring" | "Consultant" | "Customer Experience";
    description: string;
}

interface ValidationResult {
    errors: Partial<Record<keyof DiscoveryFormData, string>>;
    isValid: boolean;
}

const isEmpty = (value: any) =>
    value === undefined || value === null || value.toString().trim() === "";

function validateDiscoveryForm(data: Partial<DiscoveryFormData>): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    const addError = (field: keyof DiscoveryFormData, message: string) => {
        errors[field] = message;
    };

    if (isEmpty(data.fullName) || data.fullName!.trim().length < 2) {
        addError("fullName", "Full Name is required and must be at least 2 characters.");
    }
    if (isEmpty(data.companyName) || data.companyName!.trim().length < 2) {
        addError("companyName", "Company Name is required and must be at least 2 characters.");
    }
    if (isEmpty(data.industry) || data.industry!.trim().length < 2) {
        addError("industry", "Industry is required.");
    }
    if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email!)) {
        addError("email", "A valid Email Address is required.");
    }
    if (isEmpty(data.phone) || !/^\d{7,}$/.test(data.phone!)) {
        addError("phone", "Official Phone Number must be at least 7 digits.");
    }
    if (isEmpty(data.areaOfInterest) || !["Training", "Hiring", "Consultant", "Customer Experience"].includes(data.areaOfInterest!)) {
        addError("areaOfInterest", "Please select a valid Area of Interest.");
    }
    if (isEmpty(data.description) || data.description!.trim().length < 10) {
        addError("description", "Brief Description is required (at least 10 characters).");
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateDiscoveryForm;
