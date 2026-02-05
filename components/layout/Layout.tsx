import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;