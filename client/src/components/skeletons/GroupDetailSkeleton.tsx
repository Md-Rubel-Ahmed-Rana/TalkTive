import { Box, Divider, Skeleton } from "@mui/material";

const GroupDetailSkeleton = () => {
  return (
    <Box className="max-w-xl mx-auto my-10 shadow-md p-5" component={"div"}>
      {/* header box  */}
      <Box className="flex gap-3" component={"div"}>
        {/* image & time box  */}
        <Box className="w-2/12 flex flex-col justify-between" component={"div"}>
          <Skeleton variant="circular" width={90} height={90} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
        </Box>
        {/* name & description box  */}
        <Box className="w-9/12 flex flex-col gap-5" component={"div"}>
          {/* name & actions box  */}
          <Box
            className="flex justify-between items-center w-full"
            component={"div"}
          >
            <Skeleton
              className="w-10/12"
              variant="text"
              sx={{ fontSize: "1.5rem" }}
            />
            <Skeleton variant="rounded" width={30} height={20} />
          </Box>
          {/* description box  */}
          <Box className="flex flex-col gap-2" component={"div"}>
            {Array.from({ length: 5 }).map((item, index) => (
              <Skeleton
                key={index}
                variant="text"
                sx={{ fontSize: "0.5rem" }}
                width={`${Math.random() * (90 - 60) + 60}%`}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Divider className="my-4" />
      <Box className="flex items-center gap-4" component={"div"}>
        <Skeleton variant="rounded" width={200} height={20} />
        <Skeleton variant="rounded" width={100} height={20} />
      </Box>
      {/* participants container  */}
      <Box className="mt-5 flex flex-col gap-5" component={"div"}>
        {Array.from({ length: 5 }).map((item, index) => (
          <Box
            key={index}
            className="flex justify-between items-center gap-2 w-full shadow-md p-2 rounded-md border"
            component={"div"}
          >
            <Box className="flex items-center gap-2 w-8/12" component={"div"}>
              <Skeleton variant="circular" width={60} height={50} />
              <Box className="w-full" component={"div"}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
              </Box>
            </Box>
            <Box className="w-2/12" component={"div"}>
              <Skeleton className="w-full" variant="rounded" height={30} />
            </Box>
          </Box>
        ))}
      </Box>
      <Divider className="my-5" />
      <Skeleton variant="rounded" width={200} height={20} />
      {/* group rules container  */}
      <Box className="mt-5 flex flex-col gap-5" component={"div"}>
        {Array.from({ length: 7 }).map((item, index) => (
          <Box
            key={index}
            className="flex items-center gap-2 w-full"
            component={"div"}
          >
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton
              variant="rounded"
              height={10}
              width={`${Math.random() * (90 - 60) + 60}%`}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GroupDetailSkeleton;
