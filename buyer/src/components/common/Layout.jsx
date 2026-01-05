import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, hideFooter = false, showSidebar = false }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Fixed at top */}
      {/* <Header /> */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar - Only show if showSidebar prop is true */}
        {showSidebar && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        )}

        {/* Main Content */}
        <main
          className="flex-1 transition-all duration-300"
          style={{
            marginLeft: showSidebar
              ? isSidebarCollapsed
                ? "80px"
                : "320px"
              : "0",
            marginTop: "46px", // Header height (h-24 = 96px)
          }}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      {/* {!hideFooter && <Footer />} */}
    </div>
  );
};

export default Layout;
