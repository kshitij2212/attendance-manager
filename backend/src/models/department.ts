import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description?: string | null;
}

const departmentSchema: Schema<IDepartment> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

departmentSchema.virtual("employees", {
  ref: "Employee",
  localField: "_id",
  foreignField: "department",
});

export default mongoose.model<IDepartment>("Department", departmentSchema);
