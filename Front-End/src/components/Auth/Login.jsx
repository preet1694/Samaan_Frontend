import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Package } from "lucide-react";
import { GoogleAuth } from "./GoogleAuth";
import axiosInstance, { baseURL } from "../../config/AxiosHelper";
import { jwtDecode } from "jwt-decode";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post(
        `${baseURL}/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        setError(response.data.error || "An unknown error occurred");
        return;
      }

      const data = response.data;

      localStorage.setItem("jwtToken", data.token); // JWT token

      const decodedToken = jwtDecode(data.token);

      localStorage.setItem("userId", decodedToken.id);
      localStorage.setItem("userRole", decodedToken.role);
      localStorage.setItem("email", decodedToken.sub);
      localStorage.setItem("name", decodedToken.name);

      localStorage.setItem("tokenExpiration", decodedToken.exp);

      if (decodedToken.role === "sender") {
        navigate("/search-carrier");
      } else if (decodedToken.role === "carrier") {
        navigate("/carrier/dashboard");
      } else {
        setError("Invalid role. Please contact support.");
      }
    } catch (error) {
      setError("Internal Server Error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-14">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <Package className="h-12 w-12 text-indigo-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">Samaan</span>
        </div>
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-8">
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base border-gray-300 rounded-md py-2.5"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base border-gray-300 rounded-md py-2.5"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4">
              <GoogleAuth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
