import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Countdown timer for auto-redirect
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to home when countdown reaches 0
      navigate("/");
    }
  }, [countdown, navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number with gradient */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground">
            Attempted path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">
              Redirecting to home in <span className="text-primary font-bold text-lg">{countdown}</span> seconds
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleGoHome}
            size="lg"
            className="gap-2 min-w-[200px]"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
          <Button 
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="gap-2 min-w-[200px]"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 opacity-50">
          <svg
            className="w-full max-w-md mx-auto"
            viewBox="0 0 400 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 100 Q 100 50, 150 100 T 250 100 T 350 100"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/30"
              fill="none"
            />
            <circle cx="50" cy="100" r="4" fill="currentColor" className="text-primary/50">
              <animate
                attributeName="cx"
                from="50"
                to="350"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
