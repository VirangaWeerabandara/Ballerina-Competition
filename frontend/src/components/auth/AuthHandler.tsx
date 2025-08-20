import React, { useEffect, useState } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, getDecodedIdToken, isLoading } = useAsgardeo();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("AuthHandler: State changed", {
      isSignedIn,
      isLoading,
      isProcessing,
      currentPath: location.pathname,
    });

    // Don't do anything while Asgardeo is still loading
    if (isLoading) {
      console.log("AuthHandler: Still loading, skipping...");
      return;
    }

    if (isSignedIn && !isProcessing) {
      console.log("AuthHandler: User signed in, processing...");
      setIsProcessing(true);
      // Register user in backend after login
      getDecodedIdToken()
        .then(async (idToken) => {
          const token = idToken.raw;
          console.log("AuthHandler: Got token, checking redirect...");
          // Only redirect to projects page if user is on the home page
          // Don't redirect if they're already on a project-related page
          if (location.pathname === "/") {
            console.log("AuthHandler: Redirecting from home to /projects");
            navigate("/projects", { replace: true });
          } else {
            console.log(
              "AuthHandler: No redirect needed, user is on:",
              location.pathname
            );
          }
        })
        .catch((error) => {
          console.error("AuthHandler: Error registering user:", error);
          // Only redirect if on home page, even if registration fails
          if (location.pathname === "/") {
            console.log(
              "AuthHandler: Redirecting from home to /projects (after error)"
            );
            navigate("/projects", { replace: true });
          }
        })
        .finally(() => {
          console.log("AuthHandler: Finished processing");
          setIsProcessing(false);
        });
    } else if (!isSignedIn && !isLoading) {
      console.log("AuthHandler: User not signed in, checking redirect...");
      // Only redirect to home page if user is not on home page
      // and not on a project-related page (let ProjectEditorPage handle its own auth)
      if (
        location.pathname !== "/" &&
        !location.pathname.startsWith("/projects")
      ) {
        console.log(
          "AuthHandler: Redirecting to home from:",
          location.pathname
        );
        navigate("/", { replace: true });
      } else {
        console.log(
          "AuthHandler: No redirect needed for unauthenticated user on:",
          location.pathname
        );
      }
    }
  }, [isSignedIn, isLoading, navigate, location.pathname, isProcessing]);

  // Show loading spinner while checking authentication
  if (isLoading || (isSignedIn && isProcessing)) {
    console.log("AuthHandler: Showing loading spinner");
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
