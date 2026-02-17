const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Employee name is required"],
        trim: true,
        lowercase: true,
        minlength: 2
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Please enter a valid phone number"]
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },
    shiftStartTime: {
        type: String,
        default: "09:00"
    },
    shiftEndTime: {
        type: String,
        default: "18:00"
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Employee", employeeSchema);
