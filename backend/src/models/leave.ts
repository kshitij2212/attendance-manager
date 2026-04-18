import mongoose, { Document, Schema } from "mongoose";

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId;
  leaveType: string;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  status?: string;
  approvedBy?: mongoose.Types.ObjectId | null;
}

const LeaveSchema: Schema<ILeave> = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ["CASUAL", "SICK", "EARNED"],
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ILeave>("Leave", LeaveSchema);
