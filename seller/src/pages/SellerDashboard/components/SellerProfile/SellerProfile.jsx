import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerProfile,
  updateSellerProfile,
} from "@/redux/slice/sellerSlice";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { seller, loading, updating } = useSelector((state) => state.seller);

  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  // ================= SYNC REDUX → FORM =================
  useEffect(() => {
    if (seller) {
      setFormData(seller);
    }
  }, [seller]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= HANDLE PHOTO =================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= UPDATE PROFILE =================
  const handleSubmit = () => {
    const data = new FormData();

    Object.entries({
      sellername: formData.sellername,
      mobile: formData.mobile,
      businessName: formData.businessName,
      category: formData.category,
      seller_status: formData.seller_status,
      seller_address: formData.seller_address,
      companyregstartionlocation: formData.companyregstartionlocation,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    if (photoFile) {
      data.append("seller_profile", photoFile);
    }

    dispatch(updateSellerProfile(data));
    setPhotoFile(null);
    setPreview(null);
  };

  // ================= UI STATES =================
  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!seller)
    return <p className="text-center mt-10 text-red-500">No data found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={preview || seller.seller_profile || "/avatar.png"}
                alt="Seller"
                className="w-28 h-28 rounded-full object-cover border-4 border-navyblue"
              />

              <label className="absolute bottom-0 right-0 bg-navyblue text-white text-xs px-2 py-1 rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <h2 className="mt-4 text-xl font-semibold">{seller.sellername}</h2>

            <p className="text-sm text-gray-500">{seller.businessName}</p>

            <p className="text-xs text-gray-400">
              {seller.companyregstartionlocation}
            </p>
          </div>

          <div className="mt-6 border-t pt-4 space-y-3 text-sm">
            <Info label="Email" value={seller.email} />
            <Info label="Mobile" value={seller.mobile} />
            <Info label="Category" value={seller.category} />
            <Info label="Seller Type" value={seller.seller_status} />
            <Info label="Status" value={seller.status} />
            <Info label="Verification" value={seller.varificationStatus} />
          </div>
        </div>

        {/* ================= RIGHT EDIT FORM ================= */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Edit Seller Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="sellername"
              value={formData.sellername || ""}
              onChange={handleChange}
            />

            <Input label="Email" value={formData.email || ""} disabled />

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
            />

            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName || ""}
              onChange={handleChange}
            />

            <Input
              label="Category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
            />

            <Input
              label="Seller Type"
              name="seller_status"
              value={formData.seller_status || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mt-5">
            <Input
              label="Address"
              name="seller_address"
              value={formData.seller_address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="px-6 py-2 border border-navyblue cursor-pointer bg-navyblue text-white rounded-lg hover:bg-white hover:text-black disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value }) => (
  <p className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </p>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-navyblue outline-none"
    />
  </div>
);
