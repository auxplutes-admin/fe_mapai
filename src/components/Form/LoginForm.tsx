import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { login } from "@/api";
import { setSessionToken } from "@/constant/session";
import { Eye, EyeOff, Loader2, AlertCircle, Users, Wrench } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = user;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // const response = await login({ 
      //   email, 
      //   password,
      //   role: selectedRole 
      // }); 
      // console.log("token", response.token);
      // setSessionToken(response.token);
      
      // Redirect based on role
      if (selectedRole === "service_center") {
        window.location.href = "/service-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          setError("Invalid credentials. Please check your email, password, and selected role.");
        } else {
          setError(error.response.data.message || "An error occurred during login.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className={cn("flex flex-col w-full max-w-md mx-auto space-y-8", className)} {...props}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Login
        </h1>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={onChange}
            required
            className="h-12 px-4 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white placeholder:text-gray-500"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
              className="h-12 px-4 pr-12 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 font-medium text-sm"
            >
              {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
            </button>
          </div>
        </div>

        {/* Reset Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Reset password
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
}


