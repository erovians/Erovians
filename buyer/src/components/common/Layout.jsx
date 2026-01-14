import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children, hideFooter = false }) => {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
