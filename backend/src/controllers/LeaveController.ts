import { Request, Response } from "express";
const Leave = require("../models/leave");
import mongoose from "../config/mongo";

const applyLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, reason, leaveType } = req.body;

    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ message: "Required Data is missing." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const apply = await Leave.create({
      employee: new mongoose.Types.ObjectId(employeeId),
      leaveType: leaveType || "CASUAL",
      totalDays,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
    });

    return res.status(201).json({ message: "Applied for Leave Successfully.", apply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
};

const approveLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    const { id } = req.params;

    const updated = await Leave.findByIdAndUpdate(
      id,
      {
        employee: new mongoose.Types.ObjectId(employeeId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "APPROVED",
      },
      { new: true }
    ).exec();

    return res.status(200).json({ message: "Leave approved Successfully.", approved: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error." });
  }
};

const rejectLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    const { id } = req.params;

    const updated = await Leave.findByIdAndUpdate(
      id,
      {
        employee: new mongoose.Types.ObjectId(employeeId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "REJECTED",
      },
      { new: true }
    ).exec();

    return res.status(200).json({ message: "Leave rejected Successfully.", rejected: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error." });
  }
};

const getallLeaves = async (_req: Request, res: Response) => {
  try {
    const allleaves = await Leave.find().populate("employee").exec();
    return res.status(200).json({ message: "All leaves fetched successfully.", allleaves });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error." });
  }
};

const getLeavesByID = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    const leave = await Leave.find({ employee: new mongoose.Types.ObjectId(employeeId as string) }).populate("employee").exec();
    return res.status(200).json({ message: "Here is leave by your id.", leave });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error." });
  }
};

export { applyLeave, approveLeave, rejectLeave, getallLeaves, getLeavesByID };
