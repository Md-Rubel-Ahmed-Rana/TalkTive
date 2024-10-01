import { Box, Skeleton } from "@mui/material";

const CodeLoadingSkeleton = () => {
  return (
    <Box
      component={"div"}
      className="relative max-h-[400px] overflow-hidden border border-gray-300 rounded-md p-3"
    >
      <Skeleton variant="rectangular" height={30} width="80%" sx={{ mb: 2 }} />

      {[...Array(8)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={20}
          width={`${Math.random() * (90 - 60) + 60}%`}
          sx={{ mb: 1.5 }}
        />
      ))}
    </Box>
  );
};

export default CodeLoadingSkeleton;
