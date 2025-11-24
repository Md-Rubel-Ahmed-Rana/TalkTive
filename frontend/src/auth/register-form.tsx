import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleLogin from "./google-login";
import PasswordInput from "@/common/password-input";

const registerSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be less than 15 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = (data: RegisterFormValues) => {
    console.log("Register data:", data);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleRegister)}
    >
      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="Enter your name"
          className="h-12 text-base"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </span>
        )}
      </div>

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

      <Button
        type="submit"
        className="h-12 text-base font-semibold mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
      <GoogleLogin />
    </form>
  );
};

export default RegisterForm;
