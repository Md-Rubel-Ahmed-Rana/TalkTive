import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "./register-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  return (
    <div
      className="w-screen h-screen relative flex items-center justify-center bg-cover bg-center bg-repeat-0"
      style={{ backgroundImage: `url('/auth-bg-image.png')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-2xl">
        <CardHeader className="relative flex items-center justify-center">
          {/* Back icon (left aligned) */}
          <Link href="/" className="absolute left-5">
            <ArrowLeft className="h-6 w-6" />
          </Link>

          {/* Centered Title */}
          <CardTitle className="text-center text-2xl font-bold w-full">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
