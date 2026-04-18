import { Request, Response } from "express";
const Department = require("../models/department");
import mongoose from "../config/mongo";

const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const existingDepartment = await Department.findOne({ name: name.toLowerCase() });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists." });
    }

    const department = await Department.create({ name: name.toLowerCase(), description });
    return res.status(201).json({ message: "Department created Successfully.", department });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllDepartment = async (_req: Request, res: Response) => {
  try {
    const allDepartment = await Department.find().populate("employees").exec();
    return res.status(200).json(allDepartment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getDepartmentbyID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const departmentbyId = await Department.findById(id).populate("employees").exec();
    if (!departmentbyId) {
      return res.status(400).json({ message: "Department not found." });
    }
    return res.status(200).json(departmentbyId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getPublicDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await Department.find({}, { name: 1 }).exec();
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { createDepartment, getAllDepartment, getDepartmentbyID, deleteDepartment, getPublicDepartments };
