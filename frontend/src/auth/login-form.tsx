import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleLogin from "./google-login";
import PasswordInput from "@/common/password-input";

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
    formState: { errors, isSubmitting },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: ILogin) => {
    console.log("Login data:", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleLogin)}>
      <div className="flex flex-col">
        <Input
          type="email"
          placeholder="Enter your email"
          className="h-12 text-base"
          {...register("email")}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      <GoogleLogin />
    </form>
  );
};

export default LoginForm;
