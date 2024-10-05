import { Box, Divider, Skeleton } from "@mui/material";

const ProfileSkeleton = () => {
  return (
    <Box
      className="w-full lg:w-1/2 mx-auto p-5 rounded-md lg:border my-10"
      component={"div"}
    >
      <Box
        className="flex flex-col lg:flex-row w-full justify-center lg:justify-between gap-3 mb-5"
        component={"div"}
      >
        <Box
          className="w-full lg:w-2/12 flex lg:block justify-center items-center"
          component={"div"}
        >
          <Skeleton
            className="mt-2"
            variant="circular"
            width={150}
            height={150}
          />
        </Box>
        <Box className="w-full lg:w-9/12" component={"div"}>
          <Box
            className="flex justify-between w-full items-center gap-2 mb-5"
            component={"div"}
          >
            <Skeleton
              className="w-11/12"
              variant="text"
              sx={{ fontSize: "2rem" }}
            />
            <Skeleton variant="rounded" width={25} height={25} />
          </Box>
          <Box className="flex flex-col gap-3" component={"div"}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
          </Box>
          <Divider className="my-4" />
          <Box className="flex gap-3 w-full" component={"div"}>
            {Array.from({ length: 5 }).map((item, index) => (
              <Box
                className="w-full flex items-center flex-wrap lg:flex-nowrap gap-3 border p-2 rounded-md"
                key={index}
              >
                <Skeleton
                  className="w-1/12"
                  variant="rounded"
                  width={20}
                  height={20}
                />
                <Skeleton
                  className="w-11/12"
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                />
              </Box>
            ))}
          </Box>
          <Divider className="my-4" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </Box>
      </Box>
      <Skeleton
        className="w-full lg:w-3/12"
        variant="text"
        sx={{ fontSize: "1rem" }}
      />
    </Box>
  );
};

export default ProfileSkeleton;
