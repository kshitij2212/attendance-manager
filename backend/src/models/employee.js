const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : [true,'Employee name is required'],
        trim: true,
        lowercase: true,
        minlength: 2
    },
    email : {
        type : String, 
        required : true, 
        lowercase : true,
        trim : true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        unique : true
    },
    password : {
        type : String, 
        required : true,
        minlength: 6,
        select: false,
    },
    phone : {
        type : String, 
        required : true,
        match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    role: {
      type: String,
      enum: {
        values: ["EMPLOYEE", "ADMIN", "HR"],
        message: "Invalid role",
      },
      default: "EMPLOYEE",
    },
    department : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Department", 
        default : null
    },
    joinDate : {
        type : Date, 
        default : Date.now
    },
    isActive : {
        type : Boolean, 
        default : true
    }
},{
    timestamps : true,
    versionKey: false
})


employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("Employee" , employeeSchema)

