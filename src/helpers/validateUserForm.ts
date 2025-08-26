import { IUser } from "../model/user";

interface ValidationResult {
    errors: Partial<Record<keyof IUser | 'currentPassword' | 'newPassword' | 'confirmPassword', string>>;
    isValid: boolean;
}

interface PasswordUpdateData {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const isEmpty = (value: any) =>
    value === undefined || value === null || value.toString().trim() === "";

const isStrongPassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
};

function validateUserForm(data: Partial<IUser>): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    if (isEmpty(data.fullName) || data.fullName!.trim().length < 2) {
        errors.fullName = "Full Name is required and must be at least 2 characters.";
    }
    if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email!)) {
        errors.email = "A valid Email Address is required.";
    }
    if (isEmpty(data.phone) || !/^\d{7,}$/.test(data.phone!)) {
        errors.phone = "Phone must be at least 7 digits.";
    }
    if (isEmpty(data.country) || data.country!.trim().length < 2) {
        errors.country = "Country is required.";
    }
    if (isEmpty(data.role) || !["talent", "trainee"].includes(data.role!)) {
        errors.role = "Role must be either 'talent' or 'trainee'.";
    }
    if (data.age !== undefined && (isNaN(Number(data.age)) || Number(data.age) < 10)) {
        errors.age = "Valid AGE is required (must be 10 or older).";
    }
    // Add more field validations as needed

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

// Validate password update
export function validatePasswordUpdate(data: PasswordUpdateData): ValidationResult {
    const errors: ValidationResult["errors"] = {};

    // Validate current password
    if (isEmpty(data.currentPassword)) {
        errors.currentPassword = "Current password is required.";
    }

    // Validate new password
    if (isEmpty(data.newPassword)) {
        errors.newPassword = "New password is required.";
    } else if (!isStrongPassword(data.newPassword!)) {
        errors.newPassword = 
            "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.";
    }

    // Validate password confirmation
    if (isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Please confirm your new password.";
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    // Check if new password is different from current password
    if (data.currentPassword === data.newPassword && !isEmpty(data.newPassword)) {
        errors.newPassword = "New password must be different from current password.";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateUserForm;
