import { Request, Response } from "express";
import Department from "../models/department";
import { handleError } from "../utils/handleError";

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
    return handleError(error, res);
  }
};

const getAllDepartment = async (_req: Request, res: Response) => {
  try {
    const allDepartment = await Department.find().populate("employees").exec();
    return res.status(200).json(allDepartment);
  } catch (error) {
    return handleError(error, res);
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
    return handleError(error, res);
  }
};

const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    return handleError(error, res);
  }
};

const getPublicDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await Department.find({}, { name: 1 }).exec();
    return res.status(200).json(departments);
  } catch (error) {
    return handleError(error, res);
  }
};

export { createDepartment, getAllDepartment, getDepartmentbyID, deleteDepartment, getPublicDepartments };
