import jwt from "jsonwebtoken";
import { success } from "zod";

// Middleware to verify JWT
export const verifyUser = (req, res, next) => {
  try {
    let accessToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    // --- 🔑 Core Logic Change for Public Access ---
    if (!accessToken) {
      req.user = {
        _id: null, // No user ID
        role: "user",
      };
      return next(); // Proceed to the next middleware (e.g., allowRoles)
    }

    // Verify token
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
      { issuer: "erovians-ecommerce-app" },
      (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized, invalid token" });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export function allowRoles(...roles) {
//   return (req, res, next) => {
//     if (!req.user?.roles?.some((role) => roles.includes(role))) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// }
export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.role;

    if (!Array.isArray(userRoles)) {
      return res.status(403).json({ message: "Invalid role format" });
    }

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
