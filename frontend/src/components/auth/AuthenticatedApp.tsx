import React, { useState, useEffect } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { Routes, Route } from "react-router-dom";
import Index from "../../pages/Index";
import ProjectsPage from "../../pages/ProjectsPage";
import NotFound from "../../pages/NotFound";
import ProjectEditorPage from "../../pages/ProjectEditorPage";
import AuthSkeletonPage from "./AuthSkeletonPage";
import AuthHandler from "./AuthHandler";

export default function AuthenticatedApp() {
  const { isSignedIn, isLoading } = useAsgardeo();
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Track authentication state changes to show skeleton during transition
  useEffect(() => {
    if (isSignedIn && !isLoading) {
      // User just authenticated, show skeleton briefly
      setShowSkeleton(true);

      // Hide skeleton after a short delay to allow data loading
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1500); // Show skeleton for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoading]);

  // Show skeleton page during authentication transition
  if (showSkeleton) {
    return <AuthSkeletonPage />;
  }

  // If user is signed in, show authenticated routes
  if (isSignedIn) {
    return (
      <>
        <AuthHandler />
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/projects/editor/:projectId"
            element={<ProjectEditorPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

  // If user is not signed in, show public routes
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
