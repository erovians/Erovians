import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  clearError,
  clearSuccess,
} from "../../lib/redux/auth/authSlice";
import { Mail, Phone, Shield, Check, X, Edit2, Globe } from "lucide-react";
import { toast } from "sonner";
import { Country } from "country-state-city";
import * as Dialog from "@radix-ui/react-dialog";
import { OTPInput } from "input-otp";

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.auth
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    gender: user.gender || "",
    buyer_country: user.buyer_country || "",
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const countries = Country.getAllCountries();

  // Toast notifications
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearSuccess());
      setIsEditingProfile(false);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, message, dispatch]);

  const handleProfileSave = async () => {
    if (!profileData.name) {
      toast.error("Name is required");
      return;
    }

    await dispatch(updateUser(profileData)).unwrap();
  };

  const handleProfileCancel = () => {
    setProfileData({
      name: user.name || "",
      gender: user.gender || "",
      buyer_country: user.buyer_country || "",
    });
    setIsEditingProfile(false);
  };

  // Email Edit Functions
  const handleSendEmailOtp = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      setTimeout(() => {
        setIsOtpSent(true);
        setOtpLoading(false);
        toast.success("OTP sent to your email");
      }, 1000);
    } catch (err) {
      setOtpLoading(false);
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    try {
      setTimeout(() => {
        setOtpLoading(false);
        toast.success("Email updated successfully!");
        setIsEmailModalOpen(false);
        resetEmailModal();
      }, 1000);
    } catch (err) {
      setOtpLoading(false);
      toast.error(err.message || "Invalid OTP");
    }
  };

  // Mobile Edit Functions
  const handleSendMobileOtp = async () => {
    if (!newMobile || !/^\d{10}$/.test(newMobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setOtpLoading(true);
    try {
      // Replace with your API call
      // await axios.post('/api/send-mobile-otp', { mobile: newMobile });

      // Simulating API call
      setTimeout(() => {
        setIsOtpSent(true);
        setOtpLoading(false);
        toast.success("OTP sent to your mobile");
      }, 1000);
    } catch (err) {
      setOtpLoading(false);
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    try {
      // Replace with your API call
      // await axios.post('/api/verify-mobile-otp', { mobile: newMobile, otp });

      // Simulating API call
      setTimeout(() => {
        setOtpLoading(false);
        toast.success("Mobile number updated successfully!");
        setIsMobileModalOpen(false);
        resetMobileModal();
        // Refresh user data or update local state
      }, 1000);
    } catch (err) {
      setOtpLoading(false);
      toast.error(err.message || "Invalid OTP");
    }
  };

  const resetEmailModal = () => {
    setNewEmail("");
    setOtp("");
    setIsOtpSent(false);
  };

  const resetMobileModal = () => {
    setNewMobile("");
    setOtp("");
    setIsOtpSent(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Personal Information
          </h2>
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="flex items-center gap-2 bg-navyblue text-white px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleProfileCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
              First Name
            </label>
            <input
              type="text"
              value={profileData.name?.split(" ")[0] || ""}
              onChange={(e) => {
                const lastName =
                  profileData.name?.split(" ").slice(1).join(" ") || "";
                setProfileData({
                  ...profileData,
                  name: `${e.target.value} ${lastName}`.trim(),
                });
              }}
              readOnly={!isEditingProfile}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                isEditingProfile ? "bg-white" : "bg-gray-50"
              }`}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.name?.split(" ").slice(1).join(" ") || ""}
              onChange={(e) => {
                const firstName = profileData.name?.split(" ")[0] || "";
                setProfileData({
                  ...profileData,
                  name: `${firstName} ${e.target.value}`.trim(),
                });
              }}
              readOnly={!isEditingProfile}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                isEditingProfile ? "bg-white" : "bg-gray-50"
              }`}
            />
          </div>
        </div>

        <div className="mt-4 md:mt-5">
          <label className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-2.5 block font-medium">
            Your Gender
          </label>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={profileData.gender === "male"}
                onChange={() =>
                  setProfileData({ ...profileData, gender: "male" })
                }
                disabled={!isEditingProfile}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm md:text-base font-medium text-gray-700">
                Male
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={profileData.gender === "female"}
                onChange={() =>
                  setProfileData({ ...profileData, gender: "female" })
                }
                disabled={!isEditingProfile}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm md:text-base font-medium text-gray-700">
                Female
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={profileData.gender === "others"}
                onChange={() =>
                  setProfileData({ ...profileData, gender: "others" })
                }
                disabled={!isEditingProfile}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm md:text-base font-medium text-gray-700">
                Others
              </span>
            </label>
          </div>
        </div>

        {/* Buyer Country */}
        <div className="mt-4 md:mt-5">
          <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
            Country
          </label>
          <div className="flex items-center gap-2 md:gap-3">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
            {isEditingProfile ? (
              <select
                value={profileData.buyer_country}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    buyer_country: e.target.value,
                  })
                }
                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={profileData.buyer_country || "Not set"}
                readOnly
                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
              />
            )}
          </div>
        </div>
      </div>

      {/* Email Address */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-5">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Email Address
          </h2>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center">
          <div className="flex items-start gap-2 md:gap-3 flex-1 w-full">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-2.5 md:mt-2 shrink-0" />
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="flex-1 w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900 break-all"
            />
          </div>
          {user.isEmailVerified ? (
            <div className="flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg whitespace-nowrap self-start md:self-auto md:ml-3">
              <Check className="w-4 h-4" />
              Verified
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-orange-600 text-xs sm:text-sm font-semibold bg-orange-50 px-3 py-2 rounded-lg whitespace-nowrap self-start md:self-auto md:ml-3">
              <X className="w-4 h-4" />
              Not Verified
            </div>
          )}
        </div>
      </div>

      {/* Mobile Number */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-5">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Mobile Number
          </h2>
          <button
            onClick={() => setIsMobileModalOpen(true)}
            className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center">
          <div className="flex items-start gap-2 md:gap-3 flex-1 w-full">
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-2.5 md:mt-2 shrink-0" />
            <input
              type="tel"
              value={user.mobile || "Not provided"}
              readOnly
              className="flex-1 w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
            />
          </div>
          {user.mobile ? (
            user.isMobileVerified ? (
              <div className="flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg whitespace-nowrap self-start md:self-auto md:ml-3">
                <Check className="w-4 h-4" />
                Verified
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-orange-600 text-xs sm:text-sm font-semibold bg-orange-50 px-3 py-2 rounded-lg whitespace-nowrap self-start md:self-auto md:ml-3">
                <X className="w-4 h-4" />
                Not Verified
              </div>
            )
          ) : null}
        </div>

        {user.mobile && !user.isMobileVerified && (
          <div className="mt-4 p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-xs sm:text-sm text-orange-800 flex items-start gap-2">
              <Shield className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
              <span>
                Your mobile number is not verified. Please verify to secure your
                account.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-5">
          FAQs
        </h2>

        <div className="space-y-4 md:space-y-5">
          <div className="pb-4 border-b border-gray-100">
            <p className="font-semibold text-sm md:text-base text-gray-900 mb-2">
              What happens when I update my email address (or mobile number)?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your login email id (or mobile number) changes, likewise. You'll
              receive all account related communication on your updated email
              address (or mobile number).
            </p>
          </div>

          <div className="pb-4 border-b border-gray-100">
            <p className="font-semibold text-sm md:text-base text-gray-900 mb-2">
              When will my account be updated with the new email address (or
              mobile number)?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              It happens as soon as you confirm the verification code sent to
              your email (or mobile) and save the changes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm md:text-base text-gray-900 mb-2">
              Does my Seller account get affected when I update my email
              address?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Erovians has a 'single sign-on' policy. Any changes will reflect
              in your Seller account also.
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-5">
          Account Actions
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base hover:bg-blue-50 px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-left sm:text-center">
            Deactivate Account
          </button>
          <button className="text-red-600 hover:text-red-700 font-semibold text-sm md:text-base hover:bg-red-50 px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-left sm:text-center">
            Delete Account
          </button>
        </div>
      </div>

      {/* Email Edit Modal */}
      <Dialog.Root
        open={isEmailModalOpen}
        onOpenChange={(open) => {
          setIsEmailModalOpen(open);
          if (!open) resetEmailModal();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {isOtpSent ? "Verify OTP" : "Update Email Address"}
            </Dialog.Title>

            {!isOtpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleSendEmailOtp}
                    disabled={otpLoading}
                    className="flex-1 bg-navyblue text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all text-sm md:text-base"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                  <Dialog.Close asChild>
                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base">
                      Cancel
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  We've sent a 6-digit OTP to <strong>{newEmail}</strong>
                </p>

                <div className="flex flex-col items-center gap-4">
                  <OTPInput
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    render={({ slots }) => (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {slots.slice(0, 2).map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="flex gap-1">
                          {slots.slice(2, 4).map((slot, idx) => (
                            <Slot key={idx + 2} {...slot} />
                          ))}
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="flex gap-1">
                          {slots.slice(4, 6).map((slot, idx) => (
                            <Slot key={idx + 4} {...slot} />
                          ))}
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleVerifyEmailOtp}
                    disabled={otp.length !== 6 || otpLoading}
                    className={`flex-1 px-4 py-2.5 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                      otp.length === 6
                        ? "bg-navyblue text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    onClick={() => setIsOtpSent(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base"
                  >
                    Back
                  </button>
                </div>

                <button
                  onClick={handleSendEmailOtp}
                  className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Mobile Edit Modal */}
      <Dialog.Root
        open={isMobileModalOpen}
        onOpenChange={(open) => {
          setIsMobileModalOpen(open);
          if (!open) resetMobileModal();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {isOtpSent ? "Verify OTP" : "Update Mobile Number"}
            </Dialog.Title>

            {!isOtpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    New Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={newMobile}
                    onChange={(e) =>
                      setNewMobile(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleSendMobileOtp}
                    disabled={otpLoading}
                    className="flex-1 bg-navyblue text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all text-sm md:text-base"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                  <Dialog.Close asChild>
                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base">
                      Cancel
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  We've sent a 6-digit OTP to <strong>{newMobile}</strong>
                </p>

                <div className="flex flex-col items-center gap-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator>
                      <span className="text-gray-400 mx-1">-</span>
                    </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator>
                      <span className="text-gray-400 mx-1">-</span>
                    </InputOTPSeparator>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={4}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleVerifyMobileOtp}
                    disabled={otp.length !== 6 || otpLoading}
                    className={`flex-1 px-4 py-2.5 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                      otp.length === 6
                        ? "bg-navyblue text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    onClick={() => setIsOtpSent(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base"
                  >
                    Back
                  </button>
                </div>

                <button
                  onClick={handleSendMobileOtp}
                  className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ProfileInfo;
