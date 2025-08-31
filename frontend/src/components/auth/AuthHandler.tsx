import React, { useEffect, useState, useCallback } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { useNavigate } from "react-router-dom";

export default function AuthHandler() {
  const navigate = useNavigate();
  const { isSignedIn, getDecodedIdToken, isLoading } = useAsgardeo();

  // Single state for tracking authentication flow
  const [authStatus, setAuthStatus] = useState<
    "idle" | "processing" | "completed"
  >("idle");

  // Handle authentication flow
  useEffect(() => {
    // Skip if still loading or already completed
    if (isLoading || authStatus === "completed") {
      return;
    }

    if (isSignedIn && authStatus === "idle") {
      console.log("AuthHandler: User signed in, processing...");
      setAuthStatus("processing");

      // Handle authentication and preloading in parallel
      Promise.all([
        // Get token for preloading
        getDecodedIdToken().catch((err) => {
          console.warn("AuthHandler: Token fetch warning:", err);
          return null;
        }),
        // Small delay to ensure smooth transition
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]).then(() => {
        setAuthStatus("completed");

        // Preload projects data for better performance
        const preloadProjects = async () => {
          try {
            const token = await getDecodedIdToken();
            if (token?.raw) {
              // Prefetch projects data
              fetch(
                `${
                  import.meta.env.VITE_BACKEND_BASE_URL
                }/projects/byEmail?email=${encodeURIComponent(
                  token.email || ""
                )}`,
                {
                  headers: {
                    Authorization: `Bearer ${token.raw}`,
                  },
                }
              ).catch(() => {
                // Silently fail preloading - it's just for performance
              });
            }
          } catch (err) {
            // Ignore preloading errors
          }
        };

        // Start preloading in the background
        preloadProjects();
      });
    }
  }, [isSignedIn, isLoading, authStatus, getDecodedIdToken]);

  // Reset auth status when authentication state changes
  useEffect(() => {
    if (isLoading) {
      setAuthStatus("idle");
    }
  }, [isLoading]);

  return null;
}
