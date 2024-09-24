import Welcome from "../common/Welcome";
import LoginForm from "./LoginForm";
const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full flex gap-10 flex-row-reverse items-center justify-center">
        <div className="w-1/3 hidden lg:block">
          <Welcome
            headClasses="text-3xl font-bold mb-4"
            descClasses="leading-8"
          />
        </div>
        <div className="1/3">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
