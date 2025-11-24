import Login from "@/auth/login";
import FullScreenLoading from "@/common/loading";
import PageMetadata from "@/common/PageMetadata";
import { useGetLoggedInUserQuery } from "@/features/auth";
import Layout from "@/layout";
import { IUser } from "@/types/user";
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
  const { data, isLoading } = useGetLoggedInUserQuery({});
  const user = data?.data as IUser;
  return (
    <>
      <PageMetadata
        title="Talktive"
        description="Welcome to Talktive - Your Ultimate Communication Solution!"
        keywords="Talktive, Home"
      />
      <div className={`${geistSans.className} ${geistMono.className}`}>
        {isLoading ? <FullScreenLoading /> : user ? <Layout /> : <Login />}
      </div>
    </>
  );
}
