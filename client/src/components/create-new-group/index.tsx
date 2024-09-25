import { IChat } from "@/interfaces/chat.interface";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { useAddNewChatMutation } from "@/features/chat";
import toast from "react-hot-toast";
import SmallLoaderSpinner from "../shared/SmallLoaderSpinner";
import { useRouter } from "next/router";

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

const CreateNewGroup = () => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createGroup, { isLoading }] = useAddNewChatMutation();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IChat>({
    mode: "onChange",
    defaultValues: {
      groupName: "",
      groupImage: null,
      groupDescription: "",
      groupRules: [""],
    },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "groupRules",
  });

  const handleCreateGroup: SubmitHandler<IChat> = async (data: IChat) => {
    data.isGroupChat = true;
    const formData = new FormData();
    formData.append("groupName", data.groupName);

    if (data.groupImage) {
      formData.append("groupImage", data.groupImage);
    }
    if (data.groupDescription) {
      formData.append("groupDescription", data.groupDescription);
    }
    if (data.groupRules) {
      formData.append("groupRules", JSON.stringify(data.groupRules));
    }

    formData.append("isGroupChat", data.isGroupChat.toString());

    formData.append("participants", JSON.stringify([user?.id]));
    if (user?.id) {
      formData.append("admin", user.id);
    }
    try {
      const result: any = await createGroup(formData);
      if (result?.data?.statusCode === 201) {
        toast.success(result?.data?.message || "Chat created successfully!");
        reset();
        const inboxLink = `/inbox/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
        router.push(inboxLink);
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to create group"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create group. Try again");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("groupImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReUpload = () => {
    setImagePreview(null);
  };

  return (
    <Box
      component={"section"}
      className="max-w-md mx-auto p-10 shadow-md my-20"
    >
      <Typography
        className="text-md lg:text-xl font-semibold text-center mb-5"
        component={"h1"}
      >
        Create new group
      </Typography>
      <Box
        component={"form"}
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleCreateGroup)}
      >
        <Box component={"div"}>
          <TextField
            size="small"
            className="w-full"
            label="Group name"
            {...register("groupName", { required: "Group name is required" })}
          />
          {errors?.groupName && (
            <Typography className="text-red-500 text-sm" component={"p"}>
              {errors?.groupName?.message}
            </Typography>
          )}
        </Box>
        <Box component={"div"}>
          <TextField
            size="small"
            className="w-full"
            label="Group description"
            {...register("groupDescription")}
          />
        </Box>
        <Box component={"div"}>
          {imagePreview ? (
            <ImagePreviewContainer>
              <Button className="" onClick={handleReUpload} variant="outlined">
                Re-upload
              </Button>
              <Avatar
                src={imagePreview}
                alt="uploaded image"
                className="w-20 h-20 rounded-full object-cover"
              />
            </ImagePreviewContainer>
          ) : (
            <Box component={"div"} className="w-full text-center">
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                size="large"
                fullWidth
                className="text-center flex items-center gap-2"
              >
                <CloudUploadIcon className="text-2xl" />
                <Typography className="text-sm" component={"span"}>
                  Group image
                </Typography>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  {...register("groupImage")}
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          )}
        </Box>
        <Typography className="">Group Rules</Typography>
        {fields.map((_, index) => (
          <Box key={index} className="flex justify-between gap-1 items-center">
            <Controller
              name={`groupRules.${index}`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label={`Rule-${index + 1}`}
                  variant="outlined"
                  className="flex-1"
                  size="small"
                  {...field}
                />
              )}
            />
            <IconButton onClick={() => remove(index)} aria-label="remove link">
              <DeleteIcon className="text-red-600" />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => append("")}
          className="w-40"
        >
          Add Rule
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          variant="contained"
          className="bg-blue-600 mt-10"
          size="large"
          fullWidth
        >
          {isLoading ? (
            <Typography className="flex items-center gap-2" component={"p"}>
              <Typography component={"span"}>Creating</Typography>
              <SmallLoaderSpinner />
            </Typography>
          ) : (
            "Create group"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateNewGroup;
