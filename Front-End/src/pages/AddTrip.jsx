import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance, { baseURL } from "../config/AxiosHelper";
export const AddTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    carrierName: "",
    source: "",
    destination: "",
    startLandmark: "",
    endLandmark: "",
    date: "",
    vehicleType: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
      fetchUserDetails(storedEmail);
    } else {
      toast.error("No email found in localStorage!");
    }
  }, []);

  const fetchUserDetails = async (email) => {
    setFetchingUser(true);
    try {
      const response = await axiosInstance.post(`${baseURL}/users/getByEmail`, {
        email,
      });

      const data = response.data; // ✅ Access parsed response data here

      setFormData((prevData) => ({
        ...prevData,
        carrierName: data.name,
      }));
    } catch (err) {
      toast.error(err.message || "Failed to fetch user details");
      console.log(err);
      setFormData((prevData) => ({ ...prevData, carrierName: "" }));
    } finally {
      setFetchingUser(false);
    }
  };

  const fetchCitySuggestions = async (query, field) => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/cities/search?query=${query}`
      );

      const data = response.data;

      if (field === "source") {
        setSourceSuggestions(data);
      } else {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "source" && value.length >= 1) {
      fetchCitySuggestions(value, "source");
    } else if (name === "destination" && value.length >= 1) {
      fetchCitySuggestions(value, "destination");
    }
  };

  const handleSelectCity = (city, field) => {
    setFormData((prev) => ({ ...prev, [field]: city }));
    if (field === "source") setSourceSuggestions([]);
    else setDestinationSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${baseURL}/trips/add`,
        formData
      );

      if (!response.ok) throw new Error("Failed to add trip");

      toast.success("Trip added successfully!");
      navigate("/carrier/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Trip
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Carrier Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Carrier Name
              </label>
              {fetchingUser ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-md mt-2" />
              ) : (
                <input
                  type="text"
                  name="carrierName"
                  value={formData.carrierName}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm"
                />
              )}
            </div>

            {/* Source & Suggestions */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {sourceSuggestions.length > 0 && (
                <ul className="absolute w-full z-10 bg-white border mt-1 max-h-40 overflow-y-auto rounded-md shadow-md">
                  {sourceSuggestions.map((city, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelectCity(city, "source")}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination & Suggestions */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {destinationSuggestions.length > 0 && (
                <ul className="absolute w-full z-10 bg-white border mt-1 max-h-40 overflow-y-auto rounded-md shadow-md">
                  {destinationSuggestions.map((city, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelectCity(city, "destination")}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Other Fields */}
            {[
              { key: "startLandmark", label: "Start Landmark" },
              { key: "endLandmark", label: "End Landmark" },
              { key: "vehicleType", label: "Vehicle Type" },
              { key: "capacity", label: "Capacity (in kg)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md shadow-sm text-white font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
