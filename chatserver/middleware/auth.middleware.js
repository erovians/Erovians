import jwt from "jsonwebtoken";

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

    // No token found
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
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
