interface TrainingFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  age: number | string;
  preferredTraining: string;
  howDidYouHear: string;
  whyJoin: string;
}

interface ValidationResult {
  errors: Partial<Record<keyof TrainingFormData, string>>;
  isValid: boolean;
}

const isEmpty = (value: any) =>
  value === undefined || value === null || value.toString().trim() === "";


export function validateTrainingForm(data: TrainingFormData): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const addError = (field: keyof TrainingFormData, message: string) => {
    errors[field] = message;
  };

  if (isEmpty(data.fullName) || data.fullName.trim().length < 2) {
    addError("fullName", "Full Name is required and must be at least 2 characters.");
  }

  if (isEmpty(data.email) || !/^\S+@\S+\.\S+$/.test(data.email)) {
    addError("email", "A valid Email Address is required.");
  }

  if (isEmpty(data.phone) || !/^\d{7,}$/.test(data.phone)) {
    addError("phone", "Phone Number must be at least 7 digits.");
  }

  if (isEmpty(data.country) || data.country.trim().length < 2) {
    addError("country", "Country is required.");
  }

  const numericAge = Number(data.age);
  if (isNaN(numericAge) || numericAge < 10) {
    addError("age", "Valid AGE is required (must be 10 or older).");
  }

  if (isEmpty(data.preferredTraining) || data.preferredTraining.trim().length < 2) {
    addError("preferredTraining", "Preferred Training is required.");
  }

  if (isEmpty(data.howDidYouHear) || data.howDidYouHear.trim().length < 2) {
    addError("howDidYouHear", "This field is required.");
  }

  if (isEmpty(data.whyJoin) || data.whyJoin.trim().length < 10) {
    addError("whyJoin", "Please provide a reason for joining (at least 10 characters).");
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
export default validateTrainingForm;