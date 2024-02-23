import Footer from "@/pages/shared/Footer";
import Navbar from "@/pages/shared/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
