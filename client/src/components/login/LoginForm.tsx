import { SubmitHandler, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoginMutation } from "@/features/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    try {
      const result: any = await loginUser(data);
      if (result?.data?.statusCode === 201) {
        toast.success(result?.data?.message || "User login successfully!");
        router.push("/inbox");
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to login. Try again!"
        );
      }
    } catch (error) {
      toast.error("Failed to login. Try again!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col gap-5 w-full"
    >
      <div>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="current-email"
          {...register("email", { required: "Email is required" })}
          className="p-0"
          fullWidth
        />
        {errors.email && (
          <p className="text-red-500 font-serif text-sm">
            {errors?.email?.message}
          </p>
        )}
      </div>
      <div>
        <TextField
          id="outlined-password-input"
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password", { required: "Password is required" })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        {errors.password && (
          <p className="text-red-500 font-serif text-sm">
            {errors?.password?.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        className="bg-blue-600 py-4"
        endIcon={!isLoading && <LockIcon />}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
