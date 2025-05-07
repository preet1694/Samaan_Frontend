import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axiosInstance, { baseURL } from "../../config/AxiosHelper";

export const GoogleAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const handleGoogleLogin = (googleCredential) => {
    setIsLoading(true);
    setErrorMessage("");

    const decoded = jwtDecode(googleCredential);
    const email = decoded.email;
    const name = decoded.name;

    axiosInstance
      .post(`${baseURL}/auth/google`, { credential: googleCredential })
      .then((response) => {
        const data = response.data;
        if (data.isNew) {
          setIsNewUser(true);
          setUserEmail(email);
          setUserName(name);
          setUserId(data._id);
        } else {
          localStorage.setItem("jwtToken", data.token); // JWT token
          localStorage.setItem("userId", data.id);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("email", data.email);
          localStorage.setItem("name", data.name);

          if (data.role === "sender") {
            navigate("/search-carrier");
          } else if (data.role === "carrier") {
            navigate("/carrier/dashboard");
          } else {
            setError("Invalid role. Please contact support.");
          }
        }
      })
      .catch(() => {
        setErrorMessage("Google login failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRoleSelection = () => {
    if (!userRole) {
      setErrorMessage("Please select a role.");
      return;
    }

    setIsLoading(true);

    axiosInstance
      .post(`${baseURL}/auth/google/register`, {
        userRole,
        userEmail,
        userName,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        localStorage.setItem("jwtToken", data.token); // JWT token
        // localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", data._id || userId);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);

        if (data.role === "sender") {
          navigate("/search-carrier");
        } else if (data.role === "carrier") {
          navigate("/carrier/dashboard");
        } else {
          setError("Invalid role. Please contact support.");
        }
      })
      .catch(() => {
        setErrorMessage("Role assignment failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      handleGoogleLogin(credentialResponse.credential);
    } else {
      setErrorMessage("Google Sign-In was unsuccessful.");
    }
  };

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  return (
    <div className="google-auth-container">
      {isLoading && (
        <div className="flex items-center justify-center mt-6 space-x-4">
          <div className="p-1.5 bg-gradient-to-tr from-green-500 via-purple-500 to-blue-500 rounded-full animate-spin">
            <div className="bg-white rounded-full">
              <div className="w-8 h-8 rounded-full"></div>
            </div>
          </div>
          <p className="text-base md:text-lg font-medium text-blue-700 animate-pulse">
            Logging in...
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 mx-auto max-w-md flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-sm animate-fade-in">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {!isNewUser ? (
        <div>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setErrorMessage("Google Sign-In failed.")}
          />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Welcome {userName}, Please Select Your Role
          </h2>
          <div className="flex justify-around mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="sender"
                checked={userRole === "sender"}
                onChange={handleRoleChange}
                className="form-radio text-blue-600"
              />
              <span>Sender</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="carrier"
                checked={userRole === "carrier"}
                onChange={handleRoleChange}
                className="form-radio text-green-600"
              />
              <span>Carrier</span>
            </label>
          </div>
          <button
            onClick={handleRoleSelection}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Registering..." : "Register and Continue"}
          </button>
        </div>
      )}
    </div>
  );
};
