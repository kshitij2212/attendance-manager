import { Response } from "express";

export const handleError = (error: any, res: Response): Response => {
  console.error(error);
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e: any) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for field: ${error.path}` });
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `${field} already exists.` });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token." });
  }
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token has expired." });
  }
  return res.status(500).json({ message: error.message || "Internal Server Error" });
};
