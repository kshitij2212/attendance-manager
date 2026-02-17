const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Employee",
        required : true,
        index : true
    },
    leaveType : {
      type: String,
      enum: ["CASUAL", "SICK", "EARNED"],
      required: true
    },
    totalDays : {
        type : Number,
        required : true,
        min : 1
    },
    startDate : {
      type: Date,
      required: true
    },
    endDate : {
      type: Date,
      required: true
    },
    reason : {
        type : String,
        required : true,
        maxlength : 500
    },
    status : {
        type : String,
        enum : ["PENDING", "APPROVED", "REJECTED"],
        default : "PENDING"
    },
    approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
    }},
    {
        timestamps : true,
        versionKey : false
    })
module.exports = mongoose.model("Leave", LeaveSchema);
