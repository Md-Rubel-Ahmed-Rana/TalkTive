/* eslint-disable @next/next/no-img-element */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Avatar, Backdrop, CircularProgress, Fade } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import CloseIcon from "@mui/icons-material/Close";
import { useChangeGroupImageMutation } from "@/features/chat";

const ImagePreviewContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "5px",
  marginTop: "10px",
  marginBottom: "10px",
});

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

type Props = {
  chatId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const GroupImageChange = ({ chatId, open, setOpen }: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadImage, { isLoading }] = useChangeGroupImageMutation();

  const handleUploadImage = async () => {
    const formData = new FormData();
    if (newImage) {
      formData.append("groupImage", newImage);
      try {
        const result: any = await uploadImage({
          chatId: chatId,
          image: formData,
        });
        if (result?.data?.statusCode === 200) {
          toast.success(
            result?.data?.message || "Group image has been changed!"
          );
          handleClose();
        } else {
          toast.error(
            result?.data?.message ||
              result?.error?.data?.message ||
              result?.error?.message ||
              "Failed to upload image"
          );
          handleClose();
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to upload image");
        handleClose();
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReUpload = () => {
    setImagePreview(null);
    setNewImage(null);
  };

  const handleClose = () => {
    setOpen(false);
    setNewImage(null);
    setImagePreview(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-96 rounded-md bg-white shadow-lg p-4">
          <Box className="flex justify-between items-center">
            <Typography
              className="text-md lg:text-xl"
              variant="h6"
              component="h2"
            >
              Change group image
            </Typography>
            <CloseIcon className="cursor-pointer" onClick={handleClose} />
          </Box>
          {newImage && imagePreview ? (
            <ImagePreviewContainer>
              <Button className="" onClick={handleReUpload} variant="outlined">
                Re-upload
              </Button>
              <Avatar
                src={imagePreview}
                alt="uploaded image"
                className="w-20 h-20 rounded-full object-cover ring-1"
              />
            </ImagePreviewContainer>
          ) : (
            <Box className="w-full text-center">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                className="my-5 py-10 w-40 mx-auto text-center"
              >
                <CloudUploadIcon className="text-6xl" />
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          )}
          <Box className="flex justify-between">
            <Button
              disabled={isLoading}
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              disabled={!newImage || isLoading}
              variant="contained"
              className="bg-blue-600"
              onClick={handleUploadImage}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GroupImageChange;
