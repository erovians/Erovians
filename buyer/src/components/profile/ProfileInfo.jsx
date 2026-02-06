import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  clearError,
  clearSuccess,
} from "../../lib/redux/auth/authSlice";
import {
  Mail,
  Phone,
  Shield,
  Check,
  X,
  Edit2,
  Globe,
  User,
  Building2,
  FileText,
  Upload,
  PenTool,
} from "lucide-react";
import { toast } from "sonner";
import { Country } from "country-state-city";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { OTPInput } from "input-otp";
import { checkUserAndSendOTP } from "../../lib/redux/auth/authSlice";
import LoadingOverlay from "../common/LoadingOverlay";

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const { profileLoading, loading, buyerLoading, error, success, message } =
    useSelector((state) => state.auth);

  // Personal Info Modal States
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [personalInfoData, setPersonalInfoData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  // Buyer Details Modal States
  const [isBuyerDetailsModalOpen, setIsBuyerDetailsModalOpen] = useState(false);
  const [buyerDetailsData, setBuyerDetailsData] = useState({
    buyer_status: "",
    buyer_country: "",
    buyer_vat_eori: "",
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
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, message, dispatch]);

  // Personal Info Modal Functions
  const handleOpenPersonalInfoModal = () => {
    const [firstName = "", ...lastNameParts] = (user.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    setPersonalInfoData({
      firstName,
      lastName,
      gender: user.gender || "",
    });
    setIsPersonalInfoModalOpen(true);
  };

  const handleSavePersonalInfo = async () => {
    if (!personalInfoData.firstName) {
      toast.error("First name is required");
      return;
    }

    const fullName =
      `${personalInfoData.firstName} ${personalInfoData.lastName}`.trim();

    const updateData = {
      name: fullName,
      gender: personalInfoData.gender,
    };

    try {
      await dispatch(updateUser(updateData)).unwrap();
      setIsPersonalInfoModalOpen(false);
      resetPersonalInfoModal();
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const resetPersonalInfoModal = () => {
    setPersonalInfoData({
      firstName: "",
      lastName: "",
      gender: "",
    });
  };

  // Buyer Details Modal Functions
  const handleOpenBuyerDetailsModal = () => {
    setBuyerDetailsData({
      buyer_status: user.buyer_data?.buyer_status || "",
      buyer_country: user.buyer_data?.buyer_country || "",
      buyer_vat_eori: user.buyer_data?.buyer_vat_eori || "",
    });
    setIsBuyerDetailsModalOpen(true);
  };

  const handleSaveBuyerDetails = async () => {
    const updateData = {
      buyer_data: {
        buyer_status: buyerDetailsData.buyer_status,
        buyer_country: buyerDetailsData.buyer_country,
        buyer_vat_eori: buyerDetailsData.buyer_vat_eori,
      },
    };

    try {
      await dispatch(updateUser(updateData)).unwrap();
      setIsBuyerDetailsModalOpen(false);
      resetBuyerDetailsModal();
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const resetBuyerDetailsModal = () => {
    setBuyerDetailsData({
      buyer_status: "",
      buyer_country: "",
      buyer_vat_eori: "",
    });
  };

  // Email Edit Functions
  const handleSendEmailOtp = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      dispatch(checkUserAndSendOTP({ email: newEmail }));
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
      setTimeout(() => {
        setOtpLoading(false);
        toast.success("Mobile number updated successfully!");
        setIsMobileModalOpen(false);
        resetMobileModal();
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

  // OTP Slot Component
  const Slot = (props) => {
    return (
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg border-2 rounded-lg flex items-center justify-center font-semibold transition-all ${
          props.isActive
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-300"
        }`}
      >
        {props.char !== null && <div>{props.char}</div>}
        {props.hasFakeCaret && <FakeCaret />}
      </div>
    );
  };

  const FakeCaret = () => {
    return (
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
        <div className="w-px h-5 bg-blue-600" />
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>
          <button
            onClick={handleOpenPersonalInfoModal}
            className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* ✅ Show loading ONLY for this section */}
        {profileLoading ? (
          <LoadingOverlay message="Loading..." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
              <div>
                <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  value={user.name?.split(" ")[0] || "Not set"}
                  readOnly
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={user.name?.split(" ").slice(1).join(" ") || "Not set"}
                  readOnly
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <div className="mt-4 md:mt-5">
              <label className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-2.5 block font-medium">
                Gender
              </label>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <label className="flex items-center gap-2 cursor-not-allowed">
                  <input
                    type="radio"
                    name="gender-display"
                    checked={user.gender === "male"}
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    Male
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-not-allowed">
                  <input
                    type="radio"
                    name="gender-display"
                    checked={user.gender === "female"}
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    Female
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-not-allowed">
                  <input
                    type="radio"
                    name="gender-display"
                    checked={user.gender === "others"}
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    Others
                  </span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Buyer Details */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-700" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Buyer Information
            </h2>
          </div>
          <button
            onClick={handleOpenBuyerDetailsModal}
            className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* ✅ Show loading ONLY for this section */}
        {buyerLoading ? (
          <LoadingOverlay message="Loading..." />
        ) : (
          <div className="space-y-4 md:space-y-5">
            {/* Account Type */}
            <div>
              <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
                Account Type
              </label>
              <input
                type="text"
                value={
                  user.buyer_data?.buyer_status
                    ? user.buyer_data.buyer_status
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    : "Not set"
                }
                readOnly
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
                Country
              </label>
              <div className="flex items-center gap-2 md:gap-3">
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={user.buyer_data?.buyer_country || "Not set"}
                  readOnly
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* VAT/EORI Number */}
            {user.buyer_data?.buyer_status === "business" && (
              <div>
                <label className="text-xs sm:text-sm text-gray-600 mb-1.5 md:mb-2 block font-medium">
                  VAT/EORI Number
                </label>
                <div className="flex items-center gap-2 md:gap-3">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={user.buyer_data?.buyer_vat_eori || "Not set"}
                    readOnly
                    className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KYC Documents & Signature */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Shield className="w-5 h-5 text-gray-700" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Verification & Documents
          </h2>
        </div>

        <div className="space-y-4 md:space-y-5">
          {/* KYC Documents */}
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3 block font-medium">
              KYC Documents
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {user.buyer_data?.buyer_kyc_hash &&
              Object.keys(user.buyer_data.buyer_kyc_hash).length > 0 ? (
                Object.entries(user.buyer_data.buyer_kyc_hash).map(
                  ([docType, docUrl]) => (
                    <div
                      key={docType}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {docType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                      </a>
                    </div>
                  )
                )
              ) : (
                <div className="col-span-full text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Upload KYC Documents
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Digital Signature */}
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3 block font-medium">
              Digital Signature
            </label>
            {user.buyer_data?.buyer_signature?.url ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <PenTool className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Signature on file
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded and verified
                    </p>
                  </div>
                </div>
                <a
                  href={user.buyer_data.buyer_signature.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </a>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <PenTool className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  No signature uploaded
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Add Digital Signature
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Address */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-5">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-700" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Email Address
            </h2>
          </div>
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
            <input
              type="email"
              value={user.email || "Not set"}
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
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-700" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Mobile Number
            </h2>
          </div>
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

      {/* Personal Info Edit Modal */}
      <Dialog.Root
        open={isPersonalInfoModalOpen}
        onOpenChange={(open) => {
          setIsPersonalInfoModalOpen(open);
          if (!open) resetPersonalInfoModal();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Update Personal Information
            </Dialog.Title>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfoData.firstName}
                  onChange={(e) =>
                    setPersonalInfoData({
                      ...personalInfoData,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Enter first name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={personalInfoData.lastName}
                  onChange={(e) =>
                    setPersonalInfoData({
                      ...personalInfoData,
                      lastName: e.target.value,
                    })
                  }
                  placeholder="Enter last name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Gender
                </label>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender-edit"
                      checked={personalInfoData.gender === "male"}
                      onChange={() =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          gender: "male",
                        })
                      }
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="text-sm md:text-base font-medium text-gray-700">
                      Male
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender-edit"
                      checked={personalInfoData.gender === "female"}
                      onChange={() =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          gender: "female",
                        })
                      }
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="text-sm md:text-base font-medium text-gray-700">
                      Female
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender-edit"
                      checked={personalInfoData.gender === "others"}
                      onChange={() =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          gender: "others",
                        })
                      }
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="text-sm md:text-base font-medium text-gray-700">
                      Others
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleSavePersonalInfo}
                  disabled={loading}
                  className="flex-1 bg-navyblue text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all text-sm md:text-base"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <Dialog.Close asChild>
                  <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base">
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Buyer Details Edit Modal */}
      <Dialog.Root
        open={isBuyerDetailsModalOpen}
        onOpenChange={(open) => {
          setIsBuyerDetailsModalOpen(open);
          if (!open) resetBuyerDetailsModal();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {loading && <LoadingOverlay />}
            <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Update Buyer Information
            </Dialog.Title>

            <div className="space-y-4">
              {/* Account Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Account Type
                </label>
                <select
                  value={buyerDetailsData.buyer_status}
                  onChange={(e) =>
                    setBuyerDetailsData({
                      ...buyerDetailsData,
                      buyer_status: e.target.value,
                    })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Account Type</option>
                  <option value="individual">Individual Buyer</option>
                  <option value="business">Business</option>
                  <option value="professional end-client">
                    Professional End-Client
                  </option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Country
                </label>
                <select
                  value={buyerDetailsData.buyer_country}
                  onChange={(e) =>
                    setBuyerDetailsData({
                      ...buyerDetailsData,
                      buyer_country: e.target.value,
                    })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VAT/EORI - Show only for business */}
              {buyerDetailsData.buyer_status === "business" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    VAT/EORI Number
                  </label>
                  <input
                    type="text"
                    value={buyerDetailsData.buyer_vat_eori}
                    onChange={(e) =>
                      setBuyerDetailsData({
                        ...buyerDetailsData,
                        buyer_vat_eori: e.target.value,
                      })
                    }
                    placeholder="Enter VAT/EORI number"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleSaveBuyerDetails}
                  disabled={loading}
                  className="flex-1 bg-navyblue text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all text-sm md:text-base"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <Dialog.Close asChild>
                  <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base">
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Email Edit Modal - (Same as before) */}
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
            {loading && <LoadingOverlay />}
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

      {/* Mobile Edit Modal - (Same structure as Email) */}
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
            {loading && <LoadingOverlay />}
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
