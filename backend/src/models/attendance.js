const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employee: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Employee',
        required : [true, "Employee is required"],
        index : true
    },
    date : {
        type : Date,
        required : [true,'Date is required'],
        index : true
    },
    checkInTime : {
        type : Date,
        default : null
    },
    checkOutTime : {
        type : Date,
        default : null,
        validate: {
            validator: function(v) {
                return !v || !this.checkInTime || v > this.checkInTime;
            },
            message: 'Check-out time must be after check-in time'
        }
    },
    totalHours : {
        type : Number,
        default : null,
        min: 0,
        max: 24
    },
    status : {
        type : String,
        enum : {
            values : ["PRESENT", "ABSENT", "LEAVE"],
            message : "Invalid status"
        },
        default : "ABSENT"
    },
    lateArrival : {
        type : Boolean,
        default : false
    }
},
    {
        timestamps : true,
        versionKey: false
    }
)

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

attendanceSchema.pre("save", function (next) {
  if (this.date) {
    const d = new Date(this.date);
    d.setHours(0, 0, 0, 0);
    this.date = d;
  }

  // 🔥 If LEAVE → sanitize & exit early
  if (this.status === "LEAVE") {
    this.checkInTime = null;
    this.checkOutTime = null;
    this.totalHours = null;
    this.lateArrival = false;
    return next();
  }

  // Auto mark present
  if (this.checkInTime && this.status === "ABSENT") {
    this.status = "PRESENT";
  }

  // Calculate hours
  if (this.checkInTime && this.checkOutTime) {
    const diff = (this.checkOutTime - this.checkInTime) / (1000 * 60 * 60);
    this.totalHours = Number(diff.toFixed(2));
  } else {
    this.totalHours = null;
  }

  if (this.checkInTime) {
    const officeStart = new Date(this.checkInTime);
    officeStart.setHours(9, 0, 0, 0);
    this.lateArrival = this.checkInTime > officeStart;
  }

  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema)