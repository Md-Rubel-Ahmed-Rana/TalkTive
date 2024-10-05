import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { useGetSingleChatQuery, useUpdateGroupMutation } from "@/features/chat";
import { IEditGroup, IGetChat } from "@/interfaces/chat.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";

const GroupEdit = () => {
  const router = useRouter();
  const { query } = router;
  const chatId = query?.id as string;
  const { data, isLoading } = useGetSingleChatQuery(chatId);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const group = data?.data as IGetChat;

  const { handleSubmit, control } = useForm<IEditGroup>({
    defaultValues: {
      groupName: group?.groupName || "",
      groupDescription: group?.groupDescription || "",
      groupRules: group?.groupRules || [""],
    },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "groupRules",
  });

  const handleUpdateGroup: SubmitHandler<IEditGroup> = async (
    data: IEditGroup
  ) => {
    try {
      const result: any = await updateGroup({ chatId: chatId, data: data });
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Group updated successfully!");
        router.back();
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to update group"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update group");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="h-full flex justify-center items-center p-2 lg:p-8">
      <Box className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-6">
        <Typography className="text-2xl font-semibold mb-4">
          Edit Group
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit(handleUpdateGroup)}
          className="space-y-4"
        >
          <Controller
            name="groupName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Group Name"
                variant="outlined"
                fullWidth
                required
              />
            )}
          />
          <Controller
            name="groupDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Group Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />

          <Typography className="">Group Rules</Typography>
          {fields.map((_, index) => (
            <Box
              key={index}
              className="flex justify-between gap-1 items-center"
            >
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
            onClick={() => append("")}
            className="w-40"
          >
            Add Rule
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="bg-blue-600"
            fullWidth
            disabled={isUpdating}
          >
            {isUpdating ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Group"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupEdit;
