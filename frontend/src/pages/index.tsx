import Login from "@/auth/login";
import PageMetadata from "@/common/PageMetadata";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <PageMetadata
        title="Talktive"
        description="Welcome to Talktive CMS"
        keywords="Talktive, CMS, Home"
      />
      <div
        className={`${geistSans.className} ${geistMono.className}`}
      >
      <Login />
      </div>
    </>
  );
}
