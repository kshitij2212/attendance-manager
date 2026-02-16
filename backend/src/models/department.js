const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "Department name is required"],
        unique : true,
        trim : true,
        lowercase : true
    },
    description : {
        type : String,
        default : null,
        trim : true,
        lowercase : true
    }
},
{
    timestamps : true,
    versionKey: false
})

departmentSchema.virtual("employees", {
  ref: "Employee",
  localField: "_id",
  foreignField: "department",
});

module.exports = mongoose.model("Department", departmentSchema);
