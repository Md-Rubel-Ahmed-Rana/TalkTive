import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundError = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-7xl font-extrabold tracking-tight text-primary mb-3">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you&apos;re trying to access doesn&apos;t exist or has been
          moved.
        </p>

        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>

      <div
        className="absolute inset-0 -z-10 opacity-20 pointer-events-none 
        bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] 
        from-primary/40 via-primary/10 to-transparent"
      ></div>
    </div>
  );
};

export default NotFoundError;
