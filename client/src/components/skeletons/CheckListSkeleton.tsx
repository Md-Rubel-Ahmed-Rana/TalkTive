import { Box, Divider, Skeleton } from "@mui/material";

const CheckListSkeleton = () => {
  return (
    <Box className="px-2" component={"div"}>
      {Array.from({ length: 10 }).map((item, index) => (
        <Box
          key={index}
          className="flex items-center w-full py-2 border-b-2 border-gray-300"
          component={"div"}
        >
          <Box className="w-2/12" component={"div"}>
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Box className="w-10/12" component={"div"}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CheckListSkeleton;
