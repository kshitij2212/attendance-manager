import { Request, Response } from "express";
import mongoose from "../config/mongo";
import Attendance from "../models/attendance";
import Employee from "../models/employee";
import Leave from "../models/leave";
import { handleError } from "../utils/handleError";

const checkIN = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeeObjId = new mongoose.Types.ObjectId(employeeId);

    const existing = await Attendance.findOne({ employee: employeeObjId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Attendance for today is already marked." });
    }

    const checkInTime = new Date();

    const attendance = await Attendance.create({
      employee: employeeObjId,
      date: today,
      checkInTime,
      status: "PRESENT",
    });

    return res.status(200).json({ message: "Check in Successfully.", attendance });
  } catch (error) {
    return handleError(error, res);
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
    attendance.checkOutTime = checkOutTime;
    await attendance.save();

    return res.status(200).json({ message: "Checked out successfully.", attendance });
  } catch (error) {
    return handleError(error, res);
  }
};

const getAllAttendance = async (_req: Request, res: Response) => {
  try {
    const allAttendance = await Attendance.find()
      .sort({ date: -1 })
      .populate({ path: "employee", populate: { path: "department" } })
      .exec();

    return res.status(200).json(allAttendance);
  } catch (error) {
    return handleError(error, res);
  }
};

const getattendancebyId = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employeeObjId = new mongoose.Types.ObjectId(employeeId as string);

    const data = await Attendance.find({ employee: employeeObjId }).sort({ date: -1 }).populate("employee").exec();
    res.status(200).json(data);
  } catch (error) {
    return handleError(error, res);
  }
};

const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await Employee.countDocuments();
    const presentToday = await Attendance.countDocuments({ date: today, status: "PRESENT" });
    const onLeaveToday = await Attendance.countDocuments({ date: today, status: "LEAVE" });
    const pendingLeaves = await Leave.countDocuments({ status: "PENDING" });

    const recentAttendance = await Attendance.find({ date: today })
      .limit(5)
      .populate("employee")
      .exec();

    return res.status(200).json({
      stats: {
        totalEmployees,
        presentToday,
        onLeaveToday,
        absentToday: totalEmployees - presentToday - onLeaveToday,
        pendingLeaves,
      },
      recentAttendance,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export { checkIN, checkOut, getAllAttendance, getattendancebyId, getDashboardStats };
