import { Loader2 } from "lucide-react";

const FullScreenLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    </div>
  );
};

export default FullScreenLoading;
