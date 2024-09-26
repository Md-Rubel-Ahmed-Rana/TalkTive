/* eslint-disable @next/next/no-img-element */
import { SubmitHandler, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { IUser } from "@/interfaces/user.interface";
import { useRegisterMutation } from "@/features/user";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImagePreviewContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "5px",
});

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IUser>();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleRegister: SubmitHandler<IUser> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", data.image[0]);
    formData.append("password", data.password);
    try {
      const result: any = await registerUser(formData);
      if (result?.data?.statusCode === 201) {
        toast.success(result?.data?.message || "User registration successful!");
        router.push("/login");
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to register. Try again!"
        );
      }
    } catch (error) {
      toast.error("Failed to register. Try again!");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReUpload = () => {
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col gap-5 w-full"
    >
      <div>
        <TextField
          label="Name"
          type="text"
          autoFocus
          {...register("name", { required: "Name is required" })}
          className="p-0"
          fullWidth
        />
        {errors.name && (
          <p className="text-red-500 font-serif text-sm">
            {errors?.name?.message}
          </p>
        )}
      </div>
      <div>
        <TextField
          id="email"
          label="Email"
          type="email"
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
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          fullWidth
          className="py-4"
        >
          Profile picture
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            {...register("image", { required: " Profile picture is required" })}
            onChange={handleImageChange}
          />
        </Button>
        {errors.image && (
          <p className="text-red-500 font-serif text-sm">
            {errors?.image?.message}
          </p>
        )}
      </div>

      {imagePreview && (
        <ImagePreviewContainer>
          <Button className="" onClick={handleReUpload} variant="outlined">
            Re-upload
          </Button>
          <img
            src={imagePreview}
            alt="uploaded image"
            className="w-16 h-16 rounded-full object-cover"
          />
        </ImagePreviewContainer>
      )}

      <div>
        <TextField
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
        className="bg-blue-600 py-4"
        endIcon={!isLoading && <PersonAddAltOutlinedIcon />}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
