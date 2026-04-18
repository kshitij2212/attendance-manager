import { Request, Response } from "express";
import mongoose from "../config/mongo";
import User from "../models/user";
import Employee from "../models/employee";
import Department from "../models/department";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists." });
    }


    let departmentId = null;
    if (department) {
      const dept = await Department.findOne({ name: department.toLowerCase() });
      if (dept) {
        departmentId = dept._id;
      } else {
        return res.status(400).json({ message: "Invalid department selected." });
      }
    }

    const user = await User.create({ email: email.toLowerCase(), password, role: role?.toUpperCase() || "EMPLOYEE" });

    const employee = await Employee.create({ user: user._id, name, department: departmentId });

    return res.status(201).json({ message: "Employee added successfully.", user, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Match = await user.comparePassword(password);
    if (!Match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const employee = await Employee.findOne({ user: user._id }).populate("department").exec();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret_key", { expiresIn: "1d" });

    return res.json({ message: "Login Successfully", token, user: { id: user._id, email: user.email, role: user.role }, employee });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid Json" });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;
    if (!userPayload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userPayload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const employee = await Employee.findOne({ user: user._id }).populate("department").exec();

    return res.json({ user, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { register, Login, getMe };
