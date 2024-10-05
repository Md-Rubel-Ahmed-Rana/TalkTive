import { Box, CircularProgress, Fade, Modal, Typography } from "@mui/material";

type Props = {
  open: boolean;
  actionText?: string;
};

const ServerActionLoadingModal = ({ open, actionText }: Props) => {
  return (
    <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
      <Fade in={open}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-96 rounded-md bg-white shadow-lg p-6 text-center">
          <CircularProgress color="primary" size={50} />
          {actionText && (
            <Typography className="mt-4 text-xl font-semibold text-gray-800">
              {actionText}
            </Typography>
          )}
          <Typography className="text-gray-500 mt-2 text-md">
            Please wait while we complete your request.
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ServerActionLoadingModal;
