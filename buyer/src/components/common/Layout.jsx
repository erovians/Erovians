import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default Layout;
