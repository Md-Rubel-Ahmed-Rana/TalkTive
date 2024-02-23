import Layout from "@/layout";
import React, { ReactElement } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  password: string;
  image: string;
};

const Register = () => {
  const { handleSubmit, register } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full flex gap-10 flex-row-reverse items-center justify-center">
        <div className="w-1/3">
          <h1 className="text-3xl font-bold mb-4">Welcome to Talktive!</h1>
          <p>
            Connect, communicate, and collaborate with Talktive! Our platform is
            designed to bring people together, making conversations easy and
            accessible. Whether you&apos;re looking to chat with friends,
            family, or colleagues, Talktive has you covered. Sign up now and
            join the conversation!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profile-image" className="font-semibold">
              Profile Image
            </label>
            <input
              {...register("image")}
              type="file"
              id="profile-image"
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Profile Image"
              required
            />
          </div>
          <div className="flex flex-col">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Register.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Register;
