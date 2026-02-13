// import { useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Header from "./Header";


// import Sidebar from "./Sidebar";
// export default function Layout() {
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);


//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);


//   // If login page → only show login
//   if (location.pathname === "/login" || location.pathname === "/verify-otp") {
//     return <Outlet />;
//   }

//   return (
//     <div className="h-screen flex flex-col overflow-hidden">
//       <Header onMenuClick={() => setIsSidebarOpen(true)} />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//           isCollapsed={isCollapsed}
//           setIsCollapsed={setIsCollapsed}
//         />

//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ Auto fullscreen on login (desktop only)
  useEffect(() => {
    const autoFullscreen = async () => {
      try {
        // Only desktop (width > 768px)
        if (window.innerWidth > 768 && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen blocked by browser');
      }
    };

    // Check if just logged in
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      autoFullscreen();
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  // ✅ ONLY resize logic (responsive safe)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If login page → only show login
  if (location.pathname === "/login" || location.pathname === "/verify-otp") {
    return <Outlet />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main className={`
        flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50
        ${isSidebarOpen ? 'lg:ml-0' : ''}
      `}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}