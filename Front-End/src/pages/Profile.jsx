import React, { useState, useEffect } from "react";
import axiosInstance, { baseURL } from "../config/AxiosHelper";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Wallet,
  IndianRupee,
} from "lucide-react";
import profileimg from "../assets/profile.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneError, setPhoneError] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const storedEmail = localStorage.getItem("email");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProfile = async () => {
    try {
      if (!storedEmail) {
        console.error("No email found in localStorage");
        return;
      }

      const response = await axiosInstance.post(`${baseURL}/users/getByEmail`, {
        email: storedEmail,
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletAmount = async () => {
    try {
      let userId = storedEmail;
      const walletResponse = await axiosInstance.get(
        `${baseURL}/wallets/${userId}`
      );
      setWalletAmount(walletResponse.data.balance || 0);
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!upiId) {
      toast.error("Enter your UPI ID");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await axiosInstance.post(`${baseURL}/payout/send`, {
        name: profile.name,
        email: profile.email,
        upi: upiId,
        amount: walletAmount * 100,
      });

      setWithdrawStatus(`✅ Payout initiated! ID: ${res.data.payoutId}`);
      await axiosInstance.put(`${baseURL}/wallets/${carrierId}/updatebalance`, {
        amount: 0,
      });
      fetchWalletAmount();
    } catch (err) {
      console.error("Withdrawal failed:", err);
      setWithdrawStatus("❌ Withdrawal failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    if (storedEmail) fetchWalletAmount();
  }, [storedEmail]);

  const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);

  const updateProfile = async () => {
    if (!validatePhoneNumber(profile.phoneNumber)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await axiosInstance.post(`${baseURL}/users/update`, profile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setPhoneError(null);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-40 bg-indigo-600">
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                {loading ? (
                  <Skeleton circle height={128} width={128} />
                ) : (
                  <img
                    className="h-32 w-32 rounded-full ring-4 ring-white z-10"
                    src={profile.profilePic || profileimg}
                    alt="Profile"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-24 px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {loading ? <Skeleton width={150} /> : profile.name}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {loading ? <Skeleton width={100} /> : profile.role}
                </p>
              </div>
              <button
                onClick={() =>
                  isEditing ? updateProfile() : setIsEditing(true)
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="flex space-x-4 mb-8">
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedIdentity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified Identity
                  </span>
                )
              )}
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedPhone && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Phone className="h-4 w-4 mr-1" />
                    Verified Phone
                  </span>
                )
              )}
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedEmail && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <Mail className="h-4 w-4 mr-1" />
                    Verified Email
                  </span>
                )
              )}
            </div>

            <div className="space-y-6">
              {["Full Name", "Email", "Phone", "Address"].map(
                (field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {index === 0 ? (
                          <User className="h-5 w-5 text-gray-400" />
                        ) : index === 1 ? (
                          <Mail className="h-5 w-5 text-gray-400" />
                        ) : index === 2 ? (
                          <Phone className="h-5 w-5 text-gray-400" />
                        ) : (
                          <MapPin className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {loading ? (
                        <Skeleton height={36} />
                      ) : (
                        <input
                          type={index === 1 ? "email" : "text"}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={
                            index === 0
                              ? profile.name || ""
                              : index === 1
                              ? profile.email || ""
                              : index === 2
                              ? profile.phoneNumber || ""
                              : profile.address || ""
                          }
                          disabled={index === 1 || !isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (index === 0)
                              setProfile((prev) => ({
                                ...prev,
                                name: value,
                              }));
                            if (index === 2)
                              setProfile((prev) => ({
                                ...prev,
                                phoneNumber: value,
                              }));
                            if (index === 3)
                              setProfile((prev) => ({
                                ...prev,
                                address: value,
                              }));
                          }}
                        />
                      )}
                    </div>
                    {phoneError && index === 2 && (
                      <p className="text-red-500 text-xs">{phoneError}</p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="mt-10">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="text-green-600 w-6 h-6" />
              <h2 className="text-lg font-semibold text-gray-800">Wallet</h2>
              <p className="text-sm text-yellow-600 mt-1 font-medium">
                ⚠️ These transactions are dummy and for testing purposes only.
              </p>
            </div>

            {isProcessing && (
              <div className="w-full mb-4 animate-fadeIn">
                <div className="h-1.5 w-full bg-indigo-100 overflow-hidden rounded-full">
                  <div className="animate-progress-bar w-full h-full bg-indigo-600 origin-left-center"></div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Available Balance:</p>
              <div className="flex items-center font-bold text-green-700 text-xl">
                <IndianRupee className="w-5 h-5 mr-1" />
                {walletAmount}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Enter UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={walletAmount === 0 || isProcessing}
              className={`w-full px-4 py-2 rounded-md text-white ${
                walletAmount === 0 || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isProcessing ? "Processing..." : `Withdraw ₹${walletAmount}`}
            </button>
            {withdrawStatus && (
              <p className="text-sm mt-3 text-center text-blue-600">
                {withdrawStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
