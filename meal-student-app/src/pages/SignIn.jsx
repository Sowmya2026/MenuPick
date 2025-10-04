import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const {
    loginWithEmail,
    loginWithGoogle,
    authError,
    clearError,
    authLoading,
  } = useAuth();
  const navigate = useNavigate();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    setLocalError("");
  }, [clearError]);

  // Combine auth error and local error
  const error = authError || localError;

  const theme = {
    primary: {
      gradient: "from-green-500 to-emerald-600",
      gradientHover: "from-green-600 to-emerald-700",
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) {
      clearError();
      setLocalError("");
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (formData.password.length < 1) {
      setLocalError("Please enter your password");
      return false;
    }

    return true;
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginWithEmail(formData.email, formData.password);

      if (result.success) {
        // Successful login - redirect handled in AuthContext
      } else {
        // Show specific error message from the result
        setLocalError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalError("");
    setIsLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result.success) {
        // Successful login - redirect handled in AuthContext
      } else if (result.error) {
        setLocalError(result.error);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-purple-50 to-red-50">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Decorative Top */}
        <div className="relative mb-2">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-green-200 rounded-full"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-green-300 rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border-4 border-white shadow-2xl shadow-green-100/50 hover:shadow-green-200/70 transition-all duration-500 transform hover:-translate-y-1">
          {/* Header Section */}
          <div className="text-center pt-6 px-6">
            <div className="mx-auto w-16 h-16 mb-4 transform hover:scale-110 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="MenuPick"
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div className="relative inline-block">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-1">
                Welcome Back
              </h2>
              <Sparkles
                size={16}
                className="absolute -top-1 -right-4 text-purple-500 animate-pulse"
              />
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Sign in to continue
            </p>
          </div>

          <form className="p-4 sm:p-6 space-y-4" onSubmit={handleEmailSignIn}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 animate-shake relative">
                <button
                  onClick={() => {
                    clearError();
                    setLocalError("");
                  }}
                  className="absolute right-2 top-2 text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center space-x-2">
                  <AlertCircle
                    size={16}
                    className="text-red-500 flex-shrink-0"
                  />
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Info Message for Google Sign In */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle
                  size={16}
                  className="text-blue-500 flex-shrink-0"
                />
                <p className="text-blue-600 text-xs font-medium">
                  Google Sign-In is for existing users only. New users please create an account first.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="group relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-300 bg-white/80 disabled:opacity-50"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-300 bg-white/80 disabled:opacity-50"
                  placeholder="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r ${theme.primary.gradient} hover:${theme.primary.gradientHover} text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-xs text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || authLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border-2 border-gray-100 rounded-2xl bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
              ) : (
                <GoogleIcon />
              )}
              <span className="text-sm font-medium">
                {authLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>

            {/* Don't have account */}
            <div className="text-center pt-2">
              <Link
                to="/signup"
                className="text-xs text-gray-500 hover:text-purple-600 transition-colors duration-300 disabled:opacity-50"
              >
                Don't have an account?{" "}
                <span className="font-semibold text-purple-600 hover:underline">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </div>

        {/* Decorative Bottom */}
        <div className="relative mt-2">
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-purple-200 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;