import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { createId } from "../helpers/utils";
import {
  TrainingCategory,
  trainingCategoryOptions,
  ReferralSource,
  referralSourceOptions,
  WorkPreference,
  workPreferenceOptions
} from "./types";


export type UserType = "talent" | "trainee";

export interface IUser extends Document {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: UserType;
  googleId?: string;
  avatar?: string;
  provider?: 'google' | 'local';
  isVerified?: boolean;
  password?: string;
  linkedIn?: string;
  desiredRole?: string;
  age?: number;
  howDidYouHear?: ReferralSource;
  preferredTraining?: TrainingCategory;
  reason?: string;
  cvUrl?: string;
  preference?: WorkPreference;
  createdAt?: Date;

  // Instance methods
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: createId,
      index: true, // Add index for better query performance
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    country: { type: String, required: true },
    role: { type: String, enum: ["talent", "trainee"], default: "talent" },

    // OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    provider: { type: String, enum: ['google', 'local'], default: 'local' },
    isVerified: { type: Boolean, default: false },
    password: { 
      type: String,
      required: function(this: IUser) {
        return this.provider === 'local'; // Password required only for local accounts
      },
    },

    linkedIn: { type: String },
    desiredRole: { type: String },
    preference: { type: String, enum: workPreferenceOptions },
    cvUrl: { type: String },

    age: { type: Number },
    howDidYouHear: { type: String, enum: referralSourceOptions },
    preferredTraining: { type: String, enum: trainingCategoryOptions },
    reason: { type: String },
  },
  { 
    timestamps: true,
    id: false, // Disable the default `id` virtual getter
    toJSON: { 
      transform: function(doc, ret) {
        delete ret._id; // Remove _id from JSON responses
        return ret;
      }
    }
  }
);

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  // Skip if password hasn't been modified
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    const password = this.password as string;
    this.password = await bcrypt.hash(password, salt);
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Password hashing failed'));
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Handle case where password doesn't exist (e.g., OAuth users)
    if (!this.password || !candidatePassword) return false;
    
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Password validation middleware
UserSchema.pre('validate', function(next) {
  // Skip validation for OAuth users or if password is not being modified
  if (this.provider === 'google' || !this.isModified('password')) {
    return next();
  }

  // Only validate password if it's being set (for non-OAuth users)
  if (this.password && typeof this.password === 'string') {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      return next(new Error(
        'Password must be at least 8 characters long and contain at least one uppercase letter, ' +
        'one lowercase letter, one number, and one special character'
      ));
    }
  }

  next();
});

export default mongoose.model<IUser>("User", UserSchema);
