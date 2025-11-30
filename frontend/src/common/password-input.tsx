import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps<T extends FieldValues> = {
  name: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: string;
  className?: string;
  isLoading?: boolean;
};

const PasswordInput = <T extends FieldValues>({
  name,
  placeholder,
  register,
  error,
  className,
  isLoading,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`h-12 dark:text-gray-700  pr-10 ${className || ""}`}
        {...register(name)}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={`absolute right-3 ${
          error ? "top-1/3 -translate-y-1/2" : "top-1/2 -translate-y-1/2"
        } text-gray-400 hover:text-gray-600  cursor-pointer`}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default PasswordInput;
