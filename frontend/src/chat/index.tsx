import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const ChatContainer = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Chat Feature Coming Soon
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            We&apos;re actively working on bringing you a smooth and powerful
            chat experience. Thank you for your patience and support — it truly
            means a lot to us!
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatContainer;
