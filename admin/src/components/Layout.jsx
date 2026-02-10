// import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { useLocation } from "react-router-dom";

// const location = useLocation();

// if (location.pathname === "/login") {
//   return <Outlet />;
// }

// // import Login from "../pages/Login";
// export default function Layout() {
//   return (
//     <div className="h-screen flex flex-col">

//       {/* ✅ FULL WIDTH HEADER */}
//       <Header />
// {/* <Login /> */}
//       {/* ✅ BELOW HEADER → sidebar + content */}
//       <div className="flex flex-1 overflow-hidden">

//         <Sidebar />

//         <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           <Outlet />
//         </main>

//       </div>

//     </div>
//   );

// }


import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  // ✅ If login page → only show login (no sidebar/header)
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <Header />

      {/* Sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

