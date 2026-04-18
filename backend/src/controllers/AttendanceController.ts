import { Request, Response } from "express";
const mongoose = require('../config/mongo')
const Attendance = require("../models/attendance");

const checkIN = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    const dateOnly = new Date(today.toISOString().split("T")[0]);

    const employeeObjId = new mongoose.Types.ObjectId(employeeId);

    const existing = await Attendance.findOne({ employee: employeeObjId, date: dateOnly });
    if (existing) {
      return res.status(400).json({ message: "Attendance for today is already marked." });
    }

    const checkInTime = new Date();

    const attendance = await Attendance.create({
      employee: employeeObjId,
      date: dateOnly,
      checkInTime,
      status: "PRESENT",
    });

    return res.status(200).json({ message: "Check in Successfully.", attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
};

const checkOut = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({ message: "attendance not found." });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Person already checked out." });
    }

    if (!attendance.checkInTime) {
      return res.status(400).json({ message: "Person is not checked in." });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkInTime);
    const milliseconds = +checkOutTime - +checkInTime;
    const hours = milliseconds / (1000 * 60 * 60);
    const totalHours = Number(hours.toFixed(2));

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = totalHours;
    await attendance.save();

    return res.status(200).json({ message: "Checked out successfully.", attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
};

const getAllAttendance = async (_req: Request, res: Response) => {
  try {
    const allAttendance = await Attendance.find()
      .populate({ path: "employee", populate: { path: "department" } })
      .exec();

    return res.status(200).json(allAttendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
};

const getattendancebyId = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employeeObjId = new mongoose.Types.ObjectId(employeeId);

    const data = await Attendance.find({ employee: employeeObjId }).populate("employee").exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
};

export { checkIN, checkOut, getAllAttendance, getattendancebyId };
