import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, role: 'seller' },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      issuer: 'erovians-ecommerce-app',
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id, role: 'seller' },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'erovians-ecommerce-app',
    }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
