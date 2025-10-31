import jwt from "jsonwebtoken";

// Middleware to verify JWT
export const verifyUser = (req, res, next) => {
  try {
    let accessToken;

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    }
    // 2. Check cookies
    else if (req.cookies && req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    // --- 🔑 Core Logic Change for Public Access ---
    if (!accessToken) {
      // If no token is found, assign a default 'public' role
      req.user = {
        _id: null, // No user ID
        role: "public",
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

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}
