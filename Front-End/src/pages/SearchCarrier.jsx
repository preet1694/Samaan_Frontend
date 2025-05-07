import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { Search, MessageCircle, CheckCircle } from "lucide-react";
import axiosInstance, { baseURL } from "../config/AxiosHelper";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="flex gap-4 mt-4">
      <div className="h-10 bg-gray-300 w-24 rounded-md"></div>
      <div className="h-10 bg-gray-300 w-32 rounded-md"></div>
    </div>
  </div>
);

const AutoSuggestInput = ({ label, value, onSelect, onValidChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const fetchSuggestions = debounce(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axiosInstance.get(`${baseURL}/cities/search`, {
        params: { query },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("City fetch failed", err);
    }
  }, 300);

  const validateCity = (cityName) => {
    const match = suggestions.some(
      (city) => city.toLowerCase() === cityName.trim().toLowerCase()
    );
    setIsValid(match);
    onValidChange(match);
    return match;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setTouched(true);
    fetchSuggestions(val);
    setIsValid(false); // Reset validity until validated again
    onValidChange(false);
  };

  const handleSelect = (city) => {
    setInputValue(city);
    setSuggestions([]);
    setIsValid(true);
    setTouched(true);
    onSelect(city);
    onValidChange(true);
  };

  const handleBlur = () => {
    setTouched(true);
    validateCity(inputValue);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        className="block w-full pl-3 py-2 text-base sm:text-[17px] border border-gray-300 rounded-md shadow-sm"
        placeholder="City"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-40 overflow-auto text-base">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {touched && inputValue && !isValid && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          Please select a city from the suggestions.
        </p>
      )}
    </div>
  );
};

export const SearchCarrier = () => {
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [isValidSource, setIsValidSource] = useState(false);
  const [isValidDestination, setIsValidDestination] = useState(false);

  const [carriers, setCarriers] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split("T")[0];
  const senderEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    const formattedDate = searchParams.date
      ? new Date(searchParams.date).toISOString().split("T")[0]
      : "";

    try {
      const response = await axiosInstance.get(`${baseURL}/trips/search`, {
        params: {
          source: searchParams.source,
          destination: searchParams.destination,
          date: formattedDate,
        },
      });
      console.log("Search response:", response.data);
      setCarriers(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (carriers.length > 0) {
      const fetchPrices = async () => {
        const priceData = {};
        await Promise.all(
          carriers.map(async (carrier) => {
            try {
              const priceResponse = await axiosInstance.get(
                `${baseURL}/price/calculate`,
                {
                  params: {
                    source: searchParams.source,
                    destination: searchParams.destination,
                  },
                }
              );
              priceData[carrier.id] = priceResponse.data.price;
            } catch {
              priceData[carrier.id] = "N/A";
            }
          })
        );
        setPrices(priceData);
      };
      fetchPrices();
    }
  }, [carriers, searchParams.source, searchParams.destination]);

  const handleChat = (selectedTrip) => {
    const carrierEmail = selectedTrip.email;
    if (!carrierEmail) return alert("Carrier email not found!");
    const roomId = `${senderEmail}_${carrierEmail}`;
    localStorage.setItem("roomId", roomId);
    navigate(`/join-chat?roomId=${roomId}`, {
      state: { senderEmail, carrierEmail },
    });
  };

  const handleSelectCarrier = async (trip) => {
    if (!senderEmail)
      return alert("Please log in as a sender to select a carrier.");
    try {
      await axiosInstance.post(`${baseURL}/trips/select`, {
        senderEmail,
        tripId: trip.id,
        carrierEmail: trip.email,
      });
      setSelectedTripId(trip.id);
      alert("Carrier selected successfully!");
    } catch (err) {
      console.error("Error selecting carrier:", err);
      alert("Failed to select carrier. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AutoSuggestInput
              label="From"
              value={searchParams.source}
              onSelect={(val) =>
                setSearchParams({ ...searchParams, source: val })
              }
              onValidChange={setIsValidSource}
            />

            <AutoSuggestInput
              label="To"
              value={searchParams.destination}
              onSelect={(val) =>
                setSearchParams({ ...searchParams, destination: val })
              }
              onValidChange={setIsValidDestination}
            />

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                min={todayDate}
                className="block w-full pl-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm"
                value={searchParams.date}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!isValidSource || !isValidDestination}
            className={`w-full md:w-auto mt-4 px-5 py-2.5 rounded-lg flex items-center justify-center font-semibold text-[16px] transition duration-300
                        ${
                          !isValidSource || !isValidDestination
                            ? "bg-indigo-300 cursor-not-allowed text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
          >
            <Search className="h-5 w-5 mr-2" />
            Search Carriers
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {error && <p className="text-center text-red-500">{error}</p>}
            {carriers.length === 0 && !error && (
              <p className="text-center text-gray-500">No carriers found.</p>
            )}
            <div className="space-y-6">
              {carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-[1.01] hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold">
                        {carrier.carrierName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {capitalizeFirstLetter(carrier.source)} →{" "}
                        {capitalizeFirstLetter(carrier.destination)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Start Landmark:{" "}
                        {capitalizeFirstLetter(carrier.startLandmark)}
                      </p>
                      <p className="text-sm text-gray-500">
                        End Landmark:{" "}
                        {capitalizeFirstLetter(carrier.endLandmark)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Vehicle Type: <b>{carrier.vehicleType.toUpperCase()}</b>
                      </p>
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        Price: ₹ {prices[carrier.id] || "N/A"}
                      </p>
                    </div>

                    {userRole === "sender" ? (
                      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
                        <button
                          onClick={() => handleChat(carrier)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Chat
                        </button>

                        {selectedTripId === carrier.id ? (
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center text-green-600 font-semibold">
                              <CheckCircle className="h-5 w-5 mr-1" />
                              Requested
                            </div>
                            <button
                              onClick={() => setSelectedTripId(null)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition"
                            >
                              Unselect
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectCarrier(carrier)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                          >
                            Select Carrier
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-4 md:mt-0">
                        Please Log In as a Sender to Chat
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
