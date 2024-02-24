import { useLoginUserMutation } from "@/features/user/user.api";
import Layout from "@/layout";
import React, { ReactElement } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const { handleSubmit, register } = useForm<Inputs>();
  const [loginUser] = useLoginUserMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result: any = await loginUser(data);
    Cookies.set("talktiveAccessToken", result?.data?.data, { expires: 6 });
    if (result?.data?.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: result?.data?.message,
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.replace("/inbox");
    }
    if (result?.error?.data?.statusCode === 404) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: result?.error?.data?.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full flex gap-10 flex-row-reverse items-center justify-center">
        <div className="w-1/3">
          <h1 className="text-3xl font-bold mb-4">Welcome Back to Talktive!</h1>
          <p>
            Connect, communicate, and collaborate with Talktive! Our platform is
            designed to bring people together, making conversations easy and
            accessible. Whether you&apos;re looking to chat with friends,
            family, or colleagues, Talktive has you covered. Sign in now and
            join the conversation!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Login;
