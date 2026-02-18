import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Factory, TrendingUp, Package, BarChart3, Settings, Boxes, UserCircle, Shield, Users } from "lucide-react";
import { AuthService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin" | "super_admin">("user");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Typing animation for tagline
  const fullText = step === "otp"
    ? "Enter the verification code sent to your email"
    : mode === "signin" 
      ? "Welcome back! Sign in to continue" 
      : "Create your account to get started";
  useEffect(() => {
    let currentIndex = 0;
    setDisplayText("");
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [fullText, mode, step]);
  
  // Particle system
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);
  
  useEffect(() => {
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(particleArray);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // OTP Verification Step
    if (step === "otp") {
      if (!otp.trim() || otp.length !== 6) {
        const errorMsg = "Please enter a valid 6-digit OTP";
        setError(errorMsg);
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        await AuthService.verifyOTP({ email, otp });
        toast({
          title: "Success!",
          description: "Login successful! Redirecting to dashboard...",
        });
        setTimeout(() => {
          navigate("/dashboard/overview");
        }, 500);
      } catch (err) {
        const errorMsg = "Invalid or expired OTP. Please try again.";
        setError(errorMsg);
        toast({
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Credentials Validation
    if (mode === "signin") {
      if (!email.trim() || !password.trim()) {
        const errorMsg = "Please enter email and password";
        setError(errorMsg);
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!email.trim() || !password.trim() || !fullName.trim()) {
        const errorMsg = "Please fill in all required fields";
        setError(errorMsg);
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        const errorMsg = "Passwords do not match";
        setError(errorMsg);
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }
      if (password.length < 6) {
        const errorMsg = "Password must be at least 6 characters";
        setError(errorMsg);
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        // Direct login for registered users - no OTP
        await AuthService.login({ email, password });
        toast({
          title: "Success!",
          description: "Redirecting to dashboard...",
        });
        setTimeout(() => {
          navigate("/dashboard/overview");
        }, 500);
      } else {
        // Register user first
        const registerResponse = await AuthService.register({ email, password, fullName });
        toast({
          title: "Registration Successful!",
          description: registerResponse.message,
        });
        // Then send OTP for email verification
        await AuthService.sendOTP({ email });
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        });
        setStep("otp");
      }
    } catch (err) {
      const errorMsg = mode === "signin"
        ? "Login failed. Please check your credentials."
        : "Registration failed. Email may already be in use.";
      setError(errorMsg);
      toast({
        title: mode === "signin" ? "Login Failed" : "Registration Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Ripple effect handler
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-30 animate-particle-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Floating Icons */}
        <Factory className="absolute top-20 left-10 w-16 h-16 text-blue-200 opacity-20 animate-float" style={{ animationDelay: '0s' }} />
        <Package className="absolute top-40 right-20 w-12 h-12 text-purple-200 opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        <TrendingUp className="absolute bottom-32 left-32 w-14 h-14 text-indigo-200 opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <BarChart3 className="absolute bottom-20 right-32 w-16 h-16 text-blue-200 opacity-20 animate-float" style={{ animationDelay: '1.5s' }} />
        <Settings className="absolute top-1/2 left-20 w-10 h-10 text-indigo-200 opacity-15 animate-float" style={{ animationDelay: '0.5s' }} />
        <Boxes className="absolute top-1/3 right-40 w-12 h-12 text-purple-200 opacity-15 animate-float" style={{ animationDelay: '1.8s' }} />
        
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4 animate-slide-up">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
          {/* Header */}
          <div className="text-center space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg animate-bounce-gentle">
              <Factory className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IProduction
            </h1>
            <p className="text-gray-600 text-sm h-5">
              {displayText}<span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50/80 backdrop-blur border border-red-200 rounded-lg text-red-700 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Tabs - Hidden during OTP step */}
          {step === "credentials" && (
            <div className="flex gap-2 p-1 bg-gray-100/80 backdrop-blur rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
                  mode === "signin"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
                  mode === "register"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === "credentials" ? (
              <>
                {/* Full Name Field - Registration Only */}
                {mode === "register" && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      className="h-11 bg-white/50 backdrop-blur border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-500 focus:shadow-lg focus:shadow-indigo-200/50"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-white/50 backdrop-blur border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-500 focus:shadow-lg focus:shadow-blue-200/50"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === "signin" ? "Enter your password" : "Create a password (min 6 characters)"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-white/50 backdrop-blur border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-500 focus:shadow-lg focus:shadow-purple-200/50"
                  />
                </div>

                {/* Confirm Password Field - Registration Only */}
                {mode === "register" && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="h-11 bg-white/50 backdrop-blur border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-500 focus:shadow-lg focus:shadow-purple-200/50"
                    />
                  </div>
                )}

                {/* Role Selector - Registration Only */}
                {mode === "register" && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Label className="text-sm font-medium text-gray-700">
                      Select Role
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("user")}
                        disabled={loading}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 ${
                          role === "user"
                            ? "border-blue-500 bg-blue-50/80 text-blue-700"
                            : "border-gray-200 bg-white/50 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        <UserCircle className="w-6 h-6" />
                        <span className="text-xs font-medium">User</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("admin")}
                        disabled={loading}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 ${
                          role === "admin"
                            ? "border-purple-500 bg-purple-50/80 text-purple-700"
                            : "border-gray-200 bg-white/50 text-gray-600 hover:border-purple-300"
                        }`}
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-xs font-medium">Admin</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("super_admin")}
                        disabled={loading}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 ${
                          role === "super_admin"
                            ? "border-indigo-500 bg-indigo-50/80 text-indigo-700"
                            : "border-gray-200 bg-white/50 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        <Shield className="w-6 h-6" />
                        <span className="text-xs font-medium">Super Admin</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-2 animate-fade-in-up">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    disabled={loading}
                    maxLength={6}
                    className="h-11 bg-white/50 backdrop-blur border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-500 focus:shadow-lg focus:shadow-green-200/50 text-center text-2xl tracking-widest font-bold"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to {email}
                  </p>
                  <p className="text-xs text-blue-600 text-center mt-1">
                    {mode === "register" ? "Verify your email to complete registration" : "Verify to login"}
                  </p>
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to login
                </button>
              </>
            )}

            {/* Submit Button */}
            <Button 
              ref={buttonRef}
              type="submit" 
              onClick={handleRipple}
              className="relative w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden z-10"
              disabled={loading}
            >
              {/* Ripple effects */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                  }}
                />
              ))}
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading 
                ? (step === "otp" ? "Verifying..." : mode === "signin" ? "Signing in..." : "Creating Account...")
                : (step === "otp" ? "Verify OTP" : mode === "signin" ? "Sign In" : "Register")
              }
            </Button>
          </form>

          {/* Footer Text */}
          <div className="text-center text-xs text-gray-500 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {step === "otp"
              ? "Check your email for the verification code"
              : mode === "signin" 
                ? "Secure production management system" 
                : "Join our secure production management platform"
            }
          </div>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes particle-float {
          0% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(var(--tx, 20px), var(--ty, -30px)) scale(1.2);
            opacity: 0.5;
          }
          100% { 
            transform: translate(calc(var(--tx, 20px) * 2), calc(var(--ty, -30px) * 2)) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes ripple {
          to {
            width: 500px;
            height: 500px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-particle-float { 
          animation: particle-float linear infinite; 
          --tx: ${Math.random() * 40 - 20}px;
          --ty: ${Math.random() * -60 - 20}px;
        }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Login;
