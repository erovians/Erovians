import { validateBusinessIdByCountry } from "./country.utils"; // ✅ NEW

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile) return "Mobile number is required.";
  if (!mobileRegex.test(mobile))
    return "Please enter a valid 10-digit mobile number.";
  return "";
};

// ✅ UPDATED: Now accepts country parameter
export const validatebusinessId = (businessId, country = "IN") => {
  return validateBusinessIdByCountry(businessId, country);
};

// ✅ Password validation
export const validatePassword = (password, confirmPassword) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!password) {
    return "Password is required.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

// ✅ OTP validation
export const validateOtp = (otp) => {
  if (!otp) return "OTP is required.";
  if (otp.length !== 6) return "Please enter the 6-digit OTP.";
  return "";
};
