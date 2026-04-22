import mongoose, { Document, Schema } from "mongoose";

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  totalHours?: number | null;
  status?: string;
  lateArrival?: boolean;
}

const attendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
      validate: {
        validator: function (v: Date | null) {
          const doc = this as any;
          return !v || !doc.checkInTime || v > doc.checkInTime;
        },
        message: "Check-out time must be after check-in time",
      },
    },
    totalHours: {
      type: Number,
      default: null,
      min: 0,
      max: 24,
    },
    status: {
      type: String,
      enum: {
        values: ["PRESENT", "ABSENT", "LEAVE"],
        message: "Invalid status",
      },
      default: "ABSENT",
    },
    lateArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

attendanceSchema.pre<IAttendance>("save", async function () {
  if (this.isModified("date") || this.isNew) {
    if (this.date) {
      const d = new Date(this.date as Date);
      d.setHours(0, 0, 0, 0);
      this.date = d;
    }
  }

  if (this.status === "LEAVE") {
    this.checkInTime = null;
    this.checkOutTime = null;
    this.totalHours = null;
    this.lateArrival = false;
    return;
  }

  if (this.checkInTime && this.status === "ABSENT") {
    this.status = "PRESENT";
  }

  if (this.checkInTime && this.checkOutTime) {
    const diff = (this.checkOutTime.getTime() - this.checkInTime.getTime()) / (1000 * 60 * 60);
    this.totalHours = Number(diff.toFixed(2));
  } else {
    this.totalHours = null;
  }

  if (this.checkInTime) {
    const officeStart = new Date(this.checkInTime as Date);
    officeStart.setHours(9, 0, 0, 0);
    this.lateArrival = (this.checkInTime as Date) > officeStart;
  }
});

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);
