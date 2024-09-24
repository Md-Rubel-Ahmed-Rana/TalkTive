import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Box,
  Modal,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useUpdateUserInfoMutation } from "@/features/user";
import toast from "react-hot-toast";
import SmallLoaderSpinner from "../shared/SmallLoaderSpinner";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

type FormValues = {
  name: string;
  email: string;
  title: string;
  about: string;
  links: { name: string; url: string }[];
};

const UpdateUserInfo = ({ open, setOpen }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [updateInfo, { isLoading }] = useUpdateUserInfoMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      title: user?.title || "",
      about: user?.about || "",
      links: user?.links || [{ name: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateUserInfo = async (data: FormValues) => {
    try {
      const result: any = await updateInfo({ id: user.id, data: data });
      if (result?.data?.statusCode === 200) {
        toast.success(
          result?.data?.message || "User info updated successfully!"
        );
        handleClose();
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to update info"
        );
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update info");
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute h-[90%] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-1/2 rounded-md bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography
            id="userinfo-update-modal"
            variant="h6"
            component="h2"
            className="text-sm lg:text-xl"
          >
            Update Profile Information
          </Typography>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </div>
        <form
          onSubmit={handleSubmit(handleUpdateUserInfo)}
          className="flex flex-col justify-between h-[80%]"
        >
          <div>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  className="mb-4"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  className="mb-4"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  {...field}
                />
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  className="mb-4"
                  {...field}
                />
              )}
            />

            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="About"
                  variant="outlined"
                  multiline
                  rows={4}
                  className="mb-4"
                  {...field}
                />
              )}
            />

            <Typography variant="subtitle1" className="mb-2">
              Links
            </Typography>
            {fields.map((link, index) => (
              <Box
                key={link.id}
                className="flex flex-col lg:flex-row gap-2 items-center lg:space-x-2 mb-4 border-b-2 lg:border-0"
              >
                <Controller
                  name={`links.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Link Name"
                      variant="outlined"
                      className="flex-1"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name={`links.${index}.url`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Link URL"
                      variant="outlined"
                      className="flex-1"
                      {...field}
                    />
                  )}
                />
                <IconButton
                  onClick={() => remove(index)}
                  aria-label="remove link"
                >
                  <DeleteIcon className="text-red-600" />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ name: "", url: "" })}
              className="mb-20"
            >
              Add Link
            </Button>
          </div>

          <div className="flex justify-between -mt-12">
            <Button
              disabled={isLoading}
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <p className="flex items-center gap-2">
                  <span>Saving...</span> <SmallLoaderSpinner />
                </p>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateUserInfo;
