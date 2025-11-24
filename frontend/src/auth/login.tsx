import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./login-form";

const Login = () => {
  return (
    <div
      className="w-screen h-screen relative flex items-center justify-center bg-cover bg-center bg-repeat-0"
      style={{ backgroundImage: `url('/auth-bg-image.png')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
