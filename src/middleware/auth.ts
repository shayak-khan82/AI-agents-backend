
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
