import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function RootLayout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
