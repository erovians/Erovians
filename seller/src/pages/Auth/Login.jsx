import api from "@/utils/axios.utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // 👈 using lucide-react icons (or any icon library)

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginType, setLoginType] = useState("mobile");
  const [loading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new state

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsLoading(true);

      const res = await api.post("/seller/login", formData);
      toast.success(`${res.data.message} Redirecting...`, {
        duration: 2000,
      });
      console.log("this is data", res.data);
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }

      setTimeout(() => {
        navigate("/sellerdashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <header className="w-full shadow-md h-14 sm:h-16 md:h-20 flex items-center px-4 sm:px-6">
        <Link to={"/"}>
          <img
            src={assets.logo}
            alt="Logo"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain"
          />
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-12 py-8 md:py-12 max-w-6xl mx-auto max-h-[90vh] overflow-hidden justify-center items-center">
        {/* Login Form */}
        <div className="flex justify-center h-[80%] overflow-auto">
          <div className="w-[95%] bg-white rounded-2xl shadow-lg p-10 border border-gray-300">
            {/* Logo */}
            <div className="flex mb-6">
              <img
                src={assets.logo}
                alt="Erovians"
                className="h-8 object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-center text-base font-semibold text-gray-700 border-t border-dashed p-2">
              Welcome to World’s fastest platform!
            </h2>

            {/* Login Type Selection */}
            <div className="flex justify-center gap-6 mt-6 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="mobile"
                  checked={loginType === "mobile"}
                  onChange={(e) => setLoginType(e.target.value)}
                  className="accent-navyblue focus:ring-navyblue"
                />
                Login with Mobile Number
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="email"
                  checked={loginType === "email"}
                  onChange={(e) => setLoginType(e.target.value)}
                  className="accent-navyblue focus:ring-navyblue"
                />
                Login with Email ID
              </label>
            </div>

            {/* Error / Success Messages */}
            {error && (
              <p className="text-red-500 text-center text-sm mb-2">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-center text-sm mb-2">
                {success}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Identifier */}
              <input
                type={loginType === "mobile" ? "tel" : "email"}
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder={
                  loginType === "mobile" ? "Mobile Number" : "Email ID"
                }
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-navyblue mt-4"
                required
              />

              {/* Password Field with Show/Hide */}
              <div className="relative mt-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-navyblue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Proceed Button */}
              <button
                type="submit"
                className="w-full mt-5 border border-navyblue bg-navyblue text-white py-3 rounded-md font-semibold text-sm hover:bg-white hover:text-navyblue transition flex items-center justify-center gap-3"
              >
                {loading && <Spinner />}
                {loading ? "Proceeding..." : "Proceed"}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to={"/start-selling"}
                className="text-navyblue font-medium hover:underline"
              >
                Register Now!
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Image Section */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="p-4 rounded-md shadow-sm">
            <p className="text-sm text-gray-700 mb-2">
              List with Erovians, Grow With Erovians, Explore with Erovians !!
            </p>
            <p className="text-xs text-gray-500">
              List your products to sell them worldwide.
            </p>
          </div>
          <div className="h-[60%] flex justify-center">
            <img
              src={assets.SellerSignupform}
              alt="Seller Banner"
              className="rounded-md h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
