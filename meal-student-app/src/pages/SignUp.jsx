import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
} from "lucide-react";

const SignUp = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registerWithEmail, loginWithGoogle, authLoading } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      await registerWithEmail(formData.email, formData.password, formData.name);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google sign-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: theme.colors.background }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="lg" withText={true} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
              Create Account
            </h2>
            <p className="text-sm sm:text-base" style={{ color: theme.colors.textSecondary }}>
              Join Menu today
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleEmailSignUp}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 transition-all"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 transition-all"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 text-sm sm:text-base rounded-xl border-2 transition-all"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: theme.colors.textTertiary }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 text-sm sm:text-base rounded-xl border-2 transition-all"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ color: theme.colors.textTertiary }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: theme.colors.primary,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: theme.colors.border }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs sm:text-sm" style={{ background: theme.colors.card, color: theme.colors.textSecondary }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading || authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 transition-all text-sm sm:text-base font-medium"
              style={{
                background: theme.colors.backgroundSecondary,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                opacity: (isLoading || authLoading) ? 0.7 : 1,
              }}
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {authLoading ? "Signing up..." : "Continue with Google"}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold hover:underline"
                  style={{ color: theme.colors.primary }}
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: theme.colors.textTertiary }}>
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;