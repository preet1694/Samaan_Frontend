import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, Calendar, DollarSign } from "lucide-react";
import axiosInstance, { baseURL } from "../config/AxiosHelper";

export const CarrierDashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [cancelModalTripId, setCancelModalTripId] = useState(null);
  const [completeModalTripId, setCompleteModalTripId] = useState(null);

  const today = new Date();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchTrips(storedEmail);
    }
  }, []);

  const fetchTrips = async (email) => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/trips/getusertrips`,
        {
          params: { storedEmail: email },
        }
      );
      setTrips(response.data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const acceptSender = async (tripId) => {
    try {
      await axiosInstance.put(`${baseURL}/trips/accept-sender/${tripId}`);
      fetchTrips(userEmail);
    } catch (error) {
      console.error("Error accepting sender:", error);
    }
  };

  const markTripAsCompleted = async (tripId) => {
    try {
      await axiosInstance.put(`${baseURL}/trips/complete/${tripId}`);
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId ? { ...trip, carrierCompleted: true } : trip
        )
      );
      setCompleteModalTripId(null);
    } catch (error) {
      console.error("Error marking trip as completed:", error);
    }
  };

  const requestCancelTrip = async (tripId) => {
    try {
      await axiosInstance.post(
        `${baseURL}/trips/${tripId}/cancel?role=carrier`,
        {}
      );
      setCancelModalTripId(null);
      fetchTrips(userEmail);
    } catch (error) {
      console.error("Error requesting cancellation:", error);
    }
  };

  const respondToCancelRequest = async (tripId, agree) => {
    try {
      if (agree) {
        await axiosInstance.post(
          `${baseURL}/trips/${tripId}/cancel?role=carrier`,
          {}
        );
      }
      fetchTrips(userEmail);
    } catch (error) {
      console.error("Error responding to cancellation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={<MapPin />}
            title="Total Destinations"
            value={
              new Set(
                trips
                  .filter((trip) => new Date(trip.date) >= today)
                  .map((trip) => trip.destination)
              ).size || 0
            }
          />
          <DashboardCard
            icon={<Calendar />}
            title="Upcoming Trips"
            value={
              trips.filter((trip) => new Date(trip.date) > today).length || 0
            }
          />
          <DashboardCard
            icon={<DollarSign />}
            title="Completed Trips"
            value={trips.filter((trip) => trip.carrierCompleted).length || 0}
          />
          <DashboardCard
            icon={<Package />}
            title="Pending Trips"
            value={trips.filter((trip) => !trip.carrierCompleted).length || 0}
          />
        </div>

        {/* Trip Table */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Trips</h2>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                onClick={() => navigate("/chat")}
              >
                Chats
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                onClick={() => navigate("/add-trip")}
              >
                Add New Trip
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow sm:rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <tr key={trip.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.carrierCompleted ? (
                          <span className="text-green-600 font-semibold">
                            Already Completed!!
                          </span>
                        ) : !trip.senderSelected ? (
                          <span className="text-red-500 font-medium">
                            No sender selected
                          </span>
                        ) : !trip.carrierAccepted ? (
                          <button
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            onClick={() => acceptSender(trip.id)}
                          >
                            Accept Sender
                          </button>
                        ) : trip.senderRequestedCancel &&
                          trip.carrierRequestedCancel ? (
                          <span className="text-red-600 font-semibold">
                            Cancelled
                          </span>
                        ) : trip.senderRequestedCancel &&
                          !trip.carrierRequestedCancel ? (
                          <div className="space-y-1">
                            <span className="text-orange-500 font-medium block">
                              Sender requested cancellation
                            </span>
                            <div className="flex space-x-2">
                              <button
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                                onClick={() =>
                                  respondToCancelRequest(trip.id, true)
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                                onClick={() =>
                                  respondToCancelRequest(trip.id, false)
                                }
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ) : trip.carrierRequestedCancel ? (
                          <span className="text-orange-400 font-medium">
                            Cancellation Requested
                          </span>
                        ) : (
                          <div className="space-y-1">
                            {new Date(trip.date) <= today &&
                              (trip.paid ? (
                                <button
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                  onClick={() =>
                                    setCompleteModalTripId(trip.id)
                                  }
                                >
                                  Mark as Completed
                                </button>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-300 text-yellow-900 rounded-md font-medium">
                                  Payment Pending
                                </span>
                              ))}
                            {new Date(trip.date) > today &&
                              !trip.senderRequestedCancel &&
                              !trip.carrierRequestedCancel && (
                                <button
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                  onClick={() => setCancelModalTripId(trip.id)}
                                >
                                  Request Cancel
                                </button>
                              )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No trips available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModalTripId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Cancellation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to request cancellation? It will only be
              completed when both sides agree.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalTripId(null)}
                className="px-4 py-1.5 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => requestCancelTrip(cancelModalTripId)}
                className="px-4 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Request Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completeModalTripId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Completion
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark this trip as completed?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCompleteModalTripId(null)}
                className="px-4 py-1.5 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => markTripAsCompleted(completeModalTripId)}
                className="px-4 py-1.5 text-sm rounded bg-green-500 text-white hover:bg-green-600"
              >
                Yes, Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-indigo-500 text-white p-3 rounded-full mr-4">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);
