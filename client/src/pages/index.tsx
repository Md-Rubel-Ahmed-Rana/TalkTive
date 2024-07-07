/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/layout";
import GetHead from "@/utils/Head";
import { ReactElement } from "react";

export default function Home() {
  const desc =
    "Connect, communicate, and collaborate with Talktive! Our platform is designed to bring people together, making conversations easy and accessible. Whether you're looking to chat with friends, family, or colleagues, Talktive has you covered. Sign up now and join the conversation!";
  return (
    <>
      <GetHead
        title="Home-TalkTive"
        description={desc}
        keywords="talktive, message, audio, video"
      />
      <main className="flex flex-col justify-center items-center">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center ">
              <h1 className="text-5xl font-bold">Welcome to Talktive!</h1>
              <p className="py-6 text-2xl">{desc}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

Home.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};
