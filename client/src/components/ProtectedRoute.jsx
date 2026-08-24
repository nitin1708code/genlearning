import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";


const ProtectedRoute = () => {

  const [status, setStatus] =
    useState("checking");


  useEffect(() => {

    const token =
      localStorage.getItem(
        "genlearningToken"
      );


    // No token
    if (!token) {
      setStatus("unauthorized");
      return;
    }


    const verifyToken = async () => {

      try {

        const response = await fetch(
          "https://api.genlearning.in/api/auth/me",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        const data =
          await response.json();


        // Invalid token
        if (!response.ok) {

          localStorage.removeItem(
            "genlearningToken"
          );

          localStorage.removeItem(
            "genlearningUser"
          );

          setStatus("unauthorized");

          return;
        }


        // Update current user
        localStorage.setItem(
          "genlearningUser",
          JSON.stringify(data.user)
        );


        setStatus("authorized");

      } catch (error) {

        console.error(
          "Authentication check failed:",
          error
        );

        setStatus("unauthorized");
      }
    };


    verifyToken();

  }, []);


  // While checking token
  if (status === "checking") {

    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    );
  }


  // Not authenticated
  if (status === "unauthorized") {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Authenticated
  return <Outlet />;
};


export default ProtectedRoute;