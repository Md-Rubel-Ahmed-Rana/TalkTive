import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const TalktiveGetStarted = () => {
  const handleShowDownloadMessage = () => {
    toast.info(
      "Thank you for your interest! Our Windows and mobile apps are not available yet. We truly appreciate your patience and support — we’ll notify you as soon as they’re ready!"
    );
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Talktive Logo"
          width={280}
          height={280}
          className="opacity-95"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 dark:text-gray-200">
        Welcome to Talktive
      </h1>

      {/* Subtitle */}
      <p className="text-center text-gray-700 dark:text-gray-300 mt-3 max-w-xl">
        Connect, communicate, and collaborate with people who matter. Talktive
        helps you stay in touch effortlessly—anytime, anywhere.
      </p>

      {/* Download Button */}
      <Button
        size="lg"
        className="mt-6 bg-[#25D366] hover:bg-[#1ebe5a] text-black font-medium px-8 py-6 rounded-full text-lg"
        onClick={handleShowDownloadMessage}
      >
        Download
      </Button>

      {/* Footer text */}
      <div className="flex items-center gap-2 mt-12  text-sm text-gray-600 dark:text-gray-400">
        <Lock />
        <span>Your conversations are always secure and private</span>
      </div>
    </div>
  );
};

export default TalktiveGetStarted;
