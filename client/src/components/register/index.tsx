import Welcome from "../common/Welcome";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full flex gap-10 flex-row-reverse justify-center">
        <div className="w-1/3 hidden lg:block">
          <Welcome
            headClasses="text-3xl font-bold mb-4"
            descClasses="leading-8"
          />
        </div>
        <div className="1/3">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
