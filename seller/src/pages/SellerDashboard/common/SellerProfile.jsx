import { useEffect, useState } from "react";
import {
  getSellerProfile,
  updateSellerProfile,
} from "@/services/seller.service";
import { toast } from "sonner";

export default function SellerUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sellername: "",
    businessName: "",
    category: "All",
    seller_status: "",
    seller_address: "",
    companyregstartionlocation: "",
  });

  const [sellerProfile, setSellerProfile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await getSellerProfile();
    setFormData(data.seller);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => fd.append(key, formData[key]));
      if (sellerProfile) fd.append("seller_profile", sellerProfile);
      if (documentFile) fd.append("documentUrl", documentFile);

      await updateSellerProfile(fd);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Update Seller Profile</h2>

      <input
        name="sellername"
        value={formData.sellername}
        onChange={handleChange}
        placeholder="Seller Name"
        className="input"
      />
      <input
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        placeholder="Business Name"
        className="input"
      />
      <input
        name="seller_address"
        value={formData.seller_address}
        onChange={handleChange}
        placeholder="Address"
        className="input"
      />

      <select
        name="seller_status"
        value={formData.seller_status}
        onChange={handleChange}
        className="input"
      >
        <option value="">Select Seller Type</option>
        <option value="professional">Professional</option>
        <option value="Individual">Individual</option>
      </select>

      <input
        type="file"
        onChange={(e) => setSellerProfile(e.target.files[0])}
      />
      <input type="file" onChange={(e) => setDocumentFile(e.target.files[0])} />

      <button disabled={loading} className="btn-primary">
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
