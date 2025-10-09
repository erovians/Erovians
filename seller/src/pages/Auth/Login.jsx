// import api from "@/utils/axios.utils";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//   const [formData, setFormData] = useState({ identifier: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await api.post("/seller/login", formData);

//       setSuccess(res.data.message);
//       console.log("Seller data:", res.data.seller);
//       setTimeout(() => {
//         navigate("/sellerdashboard");
//       }, 1000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-[90vh]">
//       <div className="w-full max-w-md rounded-2xl p-8">
//         {/* Title */}
//         <h2 className="text-3xl font-bold text-center text-navyblue mb-2">
//           Welcome Back 👋
//         </h2>
//         <p className="text-center text-gray-500 mb-8">
//           Login to access your account
//         </p>

//         {/* Error / Success Messages */}
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         {success && (
//           <p className="text-green-600 text-center mb-4">{success}</p>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email or Mobile */}
//           <div>
//             <label
//               htmlFor="identifier"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Email or Mobile
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 id="identifier"
//                 name="identifier"
//                 value={formData.identifier}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none"
//                 placeholder="you@example.com or 9876543210"
//               />
//               <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//                 📧
//               </span>
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none"
//                 placeholder="••••••••"
//               />
//               <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//                 🔒
//               </span>
//             </div>
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-end">
//             <a
//               href="/forgot-password"
//               className="text-sm text-navyblue hover:underline"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-navyblue text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-900 transition transform hover:scale-[1.02] active:scale-[0.98]"
//           >
//             Login
//           </button>
//         </form>

//         {/* Extra Links */}
//         <div className="mt-6 text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link
//             to="/start-selling"
//             className="text-navyblue font-medium hover:underline"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import api from "@/utils/axios.utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets"; // import the banner
import { Mail, KeyRound } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/seller/login", formData);

      setSuccess(res.data.message);
      console.log("Seller data:", res.data.seller);

      setTimeout(() => {
        navigate("/sellerdashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <header className="w-full shadow-md h-14 sm:h-16 md:h-20 flex items-center px-4 sm:px-6">
        <Link to={"/"}>
          <img
            src={assets.logo}
            alt="Logo"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain"
          />
        </Link>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-12 py-8 md:py-12 max-w-6xl mx-auto max-h-[90vh] overflow-hidden">
        {/* Login Form */}
        <div className="flex items-start justify-center overflow-auto ">
          <div className="w-full max-w-md rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-navyblue mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Login to access your account
            </p>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && (
              <p className="text-green-600 text-center mb-4">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email or Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none text-sm"
                    placeholder="you@example.com or 9876543210"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Mail size={18} />
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <KeyRound size={18} />
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-navyblue hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full border border-navyblue bg-navyblue text-white py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-navyblue transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/start-selling"
                className="text-navyblue font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-6 overflow-auto">
          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-gray-700 mb-2">
              List with Erovians, Grow With Erovians, Explore with Erovians !!
            </p>
            <p className="text-xs text-gray-500">
              List your products to sell them worldwide.
            </p>
          </div>
          <div>
            <img
              src={assets.SellerSignupform}
              alt="Seller Banner"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
