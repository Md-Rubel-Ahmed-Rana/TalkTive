import { useCreateUserMutation } from "@/features/user/user.api";
import Layout from "@/layout";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import useUploadFile from "@/hooks/useUploadFile";

type Inputs = {
  name: string;
  email: string;
  password: string;
  image: string;
};

const Register = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<Inputs>();
  const [profilePicture, setProfilePicture] = useState("");
  const [createUser] = useCreateUserMutation();

  const handleRegister: SubmitHandler<Inputs> = async (data) => {
    data.image = profilePicture;
    const result: any = await createUser(data);
    if (result?.data?.success) {
      if (result?.data?.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: result?.data?.message,
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/login");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: result?.data?.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const uploadFile = useUploadFile();

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    const uploadedFile: any = await uploadFile(selectedFile);
    setProfilePicture(uploadedFile?.url);
  };

  console.log({ profilePicture });

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
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
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
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
