import { Box, Skeleton } from "@mui/material";
import React from "react";
import MessageTopBarSkeleton from "./MessageTopBarSkeleton";

const MessageSkeleton = () => {
  return (
    <Box
      className="h-screen overflow-y-auto bg-gray-300 border-t-2"
      component={"div"}
    >
      {Array.from({ length: 20 }).map((item, index) => (
        <Box
          className="mb-5 border-b-2 border-gray-400  pb-5"
          key={index}
          component={"div"}
        >
          <MessageTopBarSkeleton />
          <Box className="flex items-center gap-3 p-2" component={"div"}>
            <Skeleton className="w-full" variant="rounded" height={100} />
            <Skeleton className="w-full" variant="rounded" height={100} />
            <Skeleton className="w-full" variant="rounded" height={100} />
          </Box>
          <Box className="flex items-center gap-3 p-2" component={"div"}>
            <Skeleton
              className="w-1/3 hidden lg:block"
              variant="rounded"
              height={100}
            />
            <Skeleton
              className="w-1/3 hidden lg:block"
              variant="rounded"
              height={100}
            />
          </Box>
          <Skeleton
            className="mt-3 w-1/3 ml-2"
            variant="text"
            sx={{ fontSize: "1rem" }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MessageSkeleton;
