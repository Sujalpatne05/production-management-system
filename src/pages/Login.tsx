import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hero-login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate to dashboard
    navigate("/dashboard/overview");
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Hero Section */}
      <div className="hidden md:flex md:w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 md:min-h-[30vh] lg:min-h-screen">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Production Management"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-12 text-foreground">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Start Your Journey With Us!</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md">
            Elevate your business with state-of-the-art Production/Manufacturing software. 
            Transform your operations into smooth, efficient processes.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10 bg-card">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">IProduction</h2>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-muted-foreground">Please Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                EMAIL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@doorsoft.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 sm:h-12 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                PASSWORD <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 sm:h-12 text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium">
              SUBMIT
            </Button>

            <div className="text-center">
              <a href="#" className="text-info hover:underline text-xs sm:text-sm">
                Forgot Password?
              </a>
            </div>
          </form>

          {/* Demo Credentials Table */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm font-medium mb-2">
              <div>Email</div>
              <div>Password</div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm items-center">
              <div>admin@doorsoft.co</div>
              <div>123456</div>
              <div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/dashboard/overview")}
                  className="h-8 text-xs sm:text-sm"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
