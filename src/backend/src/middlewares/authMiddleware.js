import jwt from "jsonwebtoken";
import User from "../models/User.js";

// auth middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token, please login again" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No token, access denied" });
  }
};

// admin check
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// instructor check
const isInstructor = (req, res, next) => {
  // admin also has instructor rights
  if (
    req.user &&
    (req.user.role === "instructor" || req.user.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Instructor access required" });
  }
};

export { protect, isAdmin, isInstructor };
