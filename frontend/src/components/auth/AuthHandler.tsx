import React, { useEffect } from "react";
import { useAsgardeo } from "@asgardeo/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAsgardeo();

  useEffect(() => {
    if (isSignedIn) {
      if (location.pathname !== "/projects") {
        navigate("/projects");
      }
    } else {
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [isSignedIn, navigate, location.pathname]);

  return null;
}
