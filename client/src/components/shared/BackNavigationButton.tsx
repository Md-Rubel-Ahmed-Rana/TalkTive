import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
const BackNavigationButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      onClick={() => router.back()}
      className="flex items-center gap-1 w-full"
    >
      <ArrowBackIcon />
      <span>Back</span>
    </Button>
  );
};

export default BackNavigationButton;
