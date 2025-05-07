import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Package } from "lucide-react";
import { GoogleAuth } from "./GoogleAuth";
import axiosInstance, { baseURL } from "../../config/AxiosHelper";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "sender",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post(`${baseURL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert(
        `Error: ${
          error.response?.data?.message ||
          "Something went wrong. Please try again."
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <Package className="h-10 w-10 text-indigo-600" />
            <span className="ml-2 text-3xl font-bold text-gray-900">
              Samaan
            </span>
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-semibold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md sm:rounded-lg sm:px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 rounded-md py-1.5"
                  placeholder="Virat Kohli"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 rounded-md py-1.5"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 rounded-md py-1.5"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-base font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 rounded-md py-1.5"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                I want to be a
              </label>
              <div className="mt-1 space-x-6">
                <label className="inline-flex items-center text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="sender"
                    checked={formData.role === "sender"}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">Sender</span>
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="radio"
                    name="role"
                    value="carrier"
                    checked={formData.role === "carrier"}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">Carrier</span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full text-base flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
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
