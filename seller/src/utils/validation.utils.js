// ✅ Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

// ✅ Mobile validation
export const validateMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile) return "Mobile number is required.";
  if (!mobileRegex.test(mobile))
    return "Please enter a valid 10-digit mobile number.";
  return "";
};

// ✅ GSTIN validation (basic format check)
export const validateGstin = (gstin) => {
  const gstinRegex = /^[0-9A-Z]{15}$/;
  if (!gstin) return "GSTIN is required.";
  if (!gstinRegex.test(gstin)) return "Please enter a valid GSTIN.";
  return "";
};

// ✅ Password validation
export const validatePassword = (password, confirmPassword) => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
};

// ✅ OTP validation
export const validateOtp = (otp) => {
  if (!otp) return "OTP is required.";
  if (otp.length !== 6) return "Please enter the 6-digit OTP.";
  return "";
};
