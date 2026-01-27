import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/overview"), 600);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("admin@doorsoft.co");
    setPassword("123456");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/overview"), 600);
    } catch (err) {
      setError("Demo login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-background dark:to-background">
      {/* Left Hero Section */}
      <div className="hidden md:flex md:w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background md:min-h-[30vh] lg:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-40"></div>
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Production Management"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-12 text-foreground space-y-6">
          <div className="space-y-3 animate-in fade-in duration-700">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">Production-ready, from day one.</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Keep your floor, finance, and fulfillment in sync. Real-time visibility, resilient workflows, and predictable output—without extra clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="rounded-xl border border-white/60 bg-white/80 dark:bg-white/5 backdrop-blur shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">99%</div>
              <div className="text-sm text-muted-foreground leading-snug">
                Uptime target with proactive monitoring and issue playbooks.
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/80 dark:bg-white/5 backdrop-blur shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">2K+</div>
              <div className="text-sm text-muted-foreground leading-snug">
                Reports generated weekly across production, finance, and QC.
              </div>
            </div>
          </div>

          <div className="mt-2 flex gap-2 max-w-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 rounded-full transition-all duration-700 animate-pulse"
                style={{ transitionDelay: `${i * 120}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 rounded-2xl border border-white/70 dark:border-white/10 bg-white/80 dark:bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5 p-6 sm:p-8 animate-in fade-in slide-in-from-right-6 duration-700">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                I
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">IProduction</h2>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-muted-foreground">Welcome back</p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium">Secure session active · TLS protected</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Login successful! Redirecting...</span>
            </div>
          )}

          {/* Micro progress indicator */}
          <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
            {[
              "Email",
              "Password",
              "Sign in",
            ].map((label, index) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: `${index * 80}ms` }}></div>
                  <span className="font-semibold text-foreground/80">{label}</span>
                </div>
                <div className="h-1 rounded-full bg-primary/15 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-primary/60 via-primary/40 to-primary/70 animate-pulse" style={{ animationDelay: `${index * 90}ms` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                EMAIL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@doorsoft.co"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                disabled={loading}
                className={`h-10 sm:h-12 text-sm transition-colors ${
                  emailError ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              {emailError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                PASSWORD <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  disabled={loading}
                  className={`h-10 sm:h-12 text-sm pr-10 transition-colors ${
                    passwordError ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-xs sm:text-sm text-blue-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* Demo Account Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-700 mb-3">Try demo account to explore:</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Email:</span>
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border">admin@doorsoft.co</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Password:</span>
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border">123456</code>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs sm:text-sm"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Try Demo
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
