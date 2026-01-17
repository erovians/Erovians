import React from "react";
import { Mail, Phone, Shield, Check, X, Edit2 } from "lucide-react";

const ProfileInfo = ({ user }) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Personal Information
          </h2>
          <button className="text-black hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-medium">
              First Name
            </label>
            <input
              type="text"
              value={user.name?.split(" ")[0] || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-medium">
              Last Name
            </label>
            <input
              type="text"
              value={user.name?.split(" ").slice(1).join(" ") || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {user.gender && (
          <div className="mt-5">
            <label className="text-sm text-gray-600 mb-3 block font-medium">
              Your Gender
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "male"}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "female"}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Female
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "others"}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Others
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Email Address */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Email Address
          </h2>
          <button className="text-black hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-3 sm:mt-0" />
          <input
            type="email"
            value={user.email || ""}
            readOnly
            className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm sm:text-base break-all"
          />
          {user.isEmailVerified ? (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
              <Check className="w-4 h-4" />
              Verified
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
              <X className="w-4 h-4" />
              Not Verified
            </div>
          )}
        </div>
      </div>

      {/* Mobile Number */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Mobile Number
          </h2>
          <button className="text-black hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 mt-3 sm:mt-0" />
          <input
            type="tel"
            value={user.mobile || "Not provided"}
            readOnly
            className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900"
          />
          {user.mobile ? (
            user.isMobileVerified ? (
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                <Check className="w-4 h-4" />
                Verified
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                <X className="w-4 h-4" />
                Not Verified
              </div>
            )
          ) : null}
        </div>

        {user.mobile && !user.isMobileVerified && (
          <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-sm text-orange-800 flex items-start gap-2">
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          FAQs
        </h2>

        <div className="space-y-5 text-sm">
          <div className="pb-5 border-b border-gray-100">
            <p className="font-semibold text-gray-900 mb-2">
              What happens when I update my email address (or mobile number)?
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your login email id (or mobile number) changes, likewise. You'll
              receive all account related communication on your updated email
              address (or mobile number).
            </p>
          </div>

          <div className="pb-5 border-b border-gray-100">
            <p className="font-semibold text-gray-900 mb-2">
              When will my account be updated with the new email address (or
              mobile number)?
            </p>
            <p className="text-gray-600 leading-relaxed">
              It happens as soon as you confirm the verification code sent to
              your email (or mobile) and save the changes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">
              Does my Seller account get affected when I update my email
              address?
            </p>
            <p className="text-gray-600 leading-relaxed">
              Erovians has a 'single sign-on' policy. Any changes will reflect
              in your Seller account also.
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          Account Actions
        </h2>

        <div className="space-y-3">
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">
            Deactivate Account
          </button>
          <br />
          <button className="text-red-600 hover:text-red-700 font-semibold text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
