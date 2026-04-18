import { Request, Response } from "express";
import mongoose from "../config/mongo";
const Employee = require("../models/employee");
const User = require("../models/user");
import bcrypt from "bcrypt";

const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, departmentId } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already existed." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), password: hashedPassword, role: role?.toUpperCase() || "EMPLOYEE" });

    const employee = await Employee.create({ user: user._id, name, department: departmentId || null });
    return res.status(201).json({ message: "Employee create successfully", employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllEmployee = async (_req: Request, res: Response) => {
  try {
    const allEmployee = await Employee.find().populate("department").populate("user").exec();
    return res.status(200).json(allEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getEmployeebyId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("department").populate("user").exec();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, departmentId } = req.body;

    const updated = await Employee.findByIdAndUpdate(
      id,
      { name, department: departmentId || null },
      { new: true }
    ).exec();

    // optionally update user email/role
    if (email || role) {
      const employeeDoc = await Employee.findById(id).exec();
      if (employeeDoc && employeeDoc.user) {
        await User.findByIdAndUpdate(employeeDoc.user, { email: email?.toLowerCase(), role: role?.toUpperCase() }).exec();
      }
    }

    return res.status(200).json({ message: "Employee Updated Successfully", employee: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id).exec();
    if (employee && employee.user) {
      await User.findByIdAndDelete(employee.user).exec();
    }

    return res.status(200).json({ message: "Employee Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const assignDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;

    const employee = await Employee.findByIdAndUpdate(id, { department: departmentId }, { new: true }).exec();
    return res.status(200).json({ message: "Department assigned successfully.", employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { createEmployee, getAllEmployee, getEmployeebyId, updateEmployee, deleteEmployee, assignDepartment };
