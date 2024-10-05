import { Box, Skeleton } from "@mui/material";

const MessageTopBarSkeleton = () => {
  return (
    <Box
      className="flex justify-between px-2 py-[14px] bg-gray-300 items-center w-full"
      component={"div"}
    >
      <Box className="flex items-center gap-3 w-10/12" component={"div"}>
        <Box component={"div"}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Box className="w-10/12" component={"div"}>
          <Skeleton
            className="w-1/2"
            variant="text"
            sx={{ fontSize: "1rem" }}
          />
          <Skeleton
            className="w-1/3"
            variant="text"
            sx={{ fontSize: "0.5rem" }}
          />
        </Box>
      </Box>
      <Box
        className="flex items-center justify-between gap-1 w-2/12"
        component={"div"}
      >
        <Skeleton
          className="hidden lg:block"
          variant="rounded"
          width={50}
          height={30}
        />
        <Skeleton
          className="hidden lg:block"
          variant="rounded"
          width={50}
          height={30}
        />
        <Skeleton variant="rounded" width={50} height={30} />
      </Box>
    </Box>
  );
};

export default MessageTopBarSkeleton;
