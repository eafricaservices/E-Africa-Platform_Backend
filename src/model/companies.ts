import mongoose, { Schema, Document } from "mongoose";
import { createId } from "../helpers/utils";
import { AreaOfInterest, areaOfInterestOptions } from "./types";

export interface ICompany extends Document {
  companyId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  areaOfInterest: AreaOfInterest[];
  description: string;
  createdAt?: Date;
}

const CompanySchema: Schema = new Schema<ICompany>(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
      default: createId,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    areaOfInterest: {
      type: [String],
      enum: areaOfInterestOptions,
      required: true,
    },
    description: { type: String, required: true },
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

export default mongoose.model<ICompany>("Company", CompanySchema);
