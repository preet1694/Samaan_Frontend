import React, { useState, useEffect } from "react";
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

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpSent && timer === 0) {
      clearInterval(interval);
      setCanResend(true); // allow resend
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleSendOtp = async () => {
    if (!formData.email) return alert("Please enter an email address.");
    try {
      setIsSendingOtp(true);
      const res = await axiosInstance.post(`${baseURL}/otp/send`, {
        email: formData.email,
      });
      if (res.status === 200) {
        setOtpSent(true);
        setCanResend(false);
        setTimer(60); // reset timer
        alert("OTP sent to your email!");
      }
    } catch (error) {
      alert("Failed to send OTP: " + (error.response?.data?.message || ""));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP.");
    try {
      setIsVerifyingOtp(true);
      const res = await axiosInstance.post(`${baseURL}/otp/verify`, {
        email: formData.email,
        otp,
      });
      if (res.status === 200) {
        alert("Email verified!");
        setIsOtpVerified(true);
      }
    } catch (error) {
      alert(
        "OTP verification failed: " + (error.response?.data?.message || "")
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!isOtpVerified) {
      alert("Please verify your email before registering.");
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
            {/* Name */}
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

            {/* Email and OTP */}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
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
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setIsOtpVerified(false);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || (otpSent && !canResend)}
                >
                  {isSendingOtp
                    ? "Sending..."
                    : otpSent && !canResend
                    ? "Sent"
                    : "Send OTP"}
                </button>
              </div>

              {otpSent && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    type="button"
                    className="mt-2 w-full bg-green-600 text-white px-3 py-1.5 rounded-md text-sm"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || isOtpVerified}
                  >
                    {isOtpVerified
                      ? "Verified ✅"
                      : isVerifyingOtp
                      ? "Verifying..."
                      : "Verify OTP"}
                  </button>
                  {!canResend && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expires in: {formatTime(timer)}
                    </p>
                  )}
                  {canResend && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="mt-2 text-indigo-600 text-sm underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
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

            {/* Role */}
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

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full text-base flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>

          {/* Google Auth */}
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
