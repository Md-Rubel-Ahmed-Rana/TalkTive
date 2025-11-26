import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleLogin from "./google-login";
import PasswordInput from "@/common/password-input";
import handleAsyncMutation from "@/utils/catchReduxAsyncMutation";
import { useLoginUserMutation } from "@/features/auth";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be less than 15 characters"),
});

export type ILogin = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (data: ILogin) => {
    await handleAsyncMutation(
      loginUser,
      data,
      200,
      {
        error: "Login failed. Please check your credentials.",
        success: "Login successful! Redirecting...",
      },
      "/"
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleLogin)}>
      <div className="flex flex-col">
        <Input
          type="email"
          placeholder="Enter your email"
          className="h-12 text-base"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </span>
        )}
      </div>

      <PasswordInput
        name="password"
        register={register}
        className="h-12 text-base"
        error={errors.password?.message}
        placeholder="Enter your password"
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center">
        <Link
          href="/register"
          className="text-sm text-blue-500 hover:underline"
        >
          Create account
        </Link>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-12 text-base font-semibold mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <GoogleLogin />
    </form>
  );
};

export default LoginForm;
