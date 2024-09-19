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
import { useLoginUserMutation } from "@/features/user/user.api";

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
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
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
