import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Check, AlertCircle, X } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // Simulate password reset process
    setTimeout(() => {
      setMessage("Password reset instructions have been sent to your email.");
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error || message) {
      setError("");
      setMessage("");
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-purple-50 to-red-50">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border-4 border-white shadow-2xl shadow-green-100/50 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <p className="text-green-600 text-sm">{message}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 animate-shake relative">
                <button
                  onClick={() => {
                    setError("");
                    clearError();
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
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="group relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500" />
              <input
                type="email"
                required
                value={email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center pt-2">
              <Link
                to="/signin"
                className="text-xs text-gray-500 hover:text-purple-600 transition-colors duration-300"
              >
                Remember your password?{" "}
                <span className="font-semibold text-purple-600 hover:underline">
                  Sign in
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;