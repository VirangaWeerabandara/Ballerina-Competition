import React, { useEffect } from "react";
import { useAsgardeo, } from "@asgardeo/react";
import { useNavigate, useLocation } from "react-router-dom";

// Add your registerUser function here or import it
async function registerUser(jwtToken: string) {
  await fetch("http://localhost:9090/users/register", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
}

export default function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, getDecodedIdToken } = useAsgardeo();

  useEffect(() => {
    if (isSignedIn) {
      // Register user in backend after login
    getDecodedIdToken().then((idToken) => {
      const token = idToken.raw;
      console.log("Bearer token:", token);
      return registerUser(token);
    });
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
