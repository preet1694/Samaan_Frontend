import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import ReactStars from "react-stars";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance, { baseURL } from "../config/AxiosHelper";
import PaymentButton from "../components/PaymentButton";

export const SenderDashboard = () => {
  const navigate = useNavigate();
  const senderEmail = localStorage.getItem("email");

  const [selectedTrips, setSelectedTrips] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [ratedTrips, setRatedTrips] = useState({});
  const [cancelModalTripId, setCancelModalTripId] = useState(null);
  const [cancelActionModalTripId, setCancelActionModalTripId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const tripsPerPage = 5;

  const fetchSelectedTrips = async () => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/trips/sender/${senderEmail}`
      );
      const sortedTrips = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSelectedTrips(sortedTrips);

      const ratingsResponse = await axiosInstance.get(
        `${baseURL}/trips/ratings/${senderEmail}`
      );

      const fetchedRatings = {};
      const fetchedFeedbacks = {};
      const fetchedRatedTrips = {};

      ratingsResponse.data.forEach((trip) => {
        fetchedRatings[trip.id] = trip.rating;
        fetchedFeedbacks[trip.id] = trip.feedback || "";
        fetchedRatedTrips[trip.id] = true;
      });

      setRatings(fetchedRatings);
      setFeedbacks(fetchedFeedbacks);
      setRatedTrips(fetchedRatedTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trip data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedTrips();
  }, []);

  const submitRatingAndFeedback = async (tripId) => {
    const rating = ratings[tripId];
    const feedback = feedbacks[tripId];

    if (!rating) {
      toast.error("Please provide a rating before submitting.");
      return;
    }

    try {
      await axiosInstance.post(
        `${baseURL}/trips/rating/${tripId}`,
        { tripId, rating, feedback },
        { headers: { "Content-Type": "application/json" } }
      );
      setRatedTrips((prev) => ({ ...prev, [tripId]: true }));
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const confirmCancelTrip = async (tripId) => {
    try {
      await axiosInstance.post(
        `${baseURL}/trips/${tripId}/cancel?role=sender`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Cancellation request sent.");
      fetchSelectedTrips();
    } catch (error) {
      console.error("Error requesting cancellation:", error);
      toast.error("Failed to request cancellation.");
    } finally {
      setCancelModalTripId(null);
    }
  };

  const acceptCancelTrip = async (tripId) => {
    try {
      await axiosInstance.post(
        `${baseURL}/trips/${tripId}/cancel?role=sender`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Cancellation accepted.");
      fetchSelectedTrips();
    } catch (error) {
      console.error("Error accepting cancellation:", error);
      toast.error("Failed to accept cancellation.");
    } finally {
      setCancelActionModalTripId(null);
    }
  };

  const declineCancelTrip = async (tripId) => {
    try {
      toast.success("Cancellation declined.");
      fetchSelectedTrips();
    } catch (error) {
      console.error("Error declining cancellation:", error);
      toast.error("Failed to decline cancellation.");
    } finally {
      setCancelActionModalTripId(null);
    }
  };

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = selectedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(selectedTrips.length / tripsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4fd] to-white px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Selected Trips
        </h2>

        <button
          onClick={() => navigate("/chat")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          Your Chats
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-indigo-100">
            <tr>
              <TableHeader>#</TableHeader>
              <TableHeader>Trip ID</TableHeader>
              <TableHeader>Carrier</TableHeader>
              <TableHeader>Source</TableHeader>
              <TableHeader>Destination</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Rating & Feedback</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: tripsPerPage }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))
            ) : selectedTrips.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              currentTrips.map((trip, idx) => {
                const {
                  id,
                  carrierName,
                  source,
                  destination,
                  carrierCompleted,
                  senderRequestedCancel,
                  carrierRequestedCancel,
                  senderSelected,
                } = trip;

                const isTripCancelled =
                  senderRequestedCancel && carrierRequestedCancel;
                const isCancelRequested =
                  senderRequestedCancel && !carrierRequestedCancel;
                const carrierRequestedOnly =
                  !senderRequestedCancel && carrierRequestedCancel;
                const showCancelButton =
                  !senderRequestedCancel && !carrierRequestedCancel;

                let statusElement = null;

                if (carrierCompleted) {
                  statusElement = (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </>
                  );
                } else if (isTripCancelled) {
                  statusElement = <>❌ Trip Cancelled</>;
                } else if (isCancelRequested) {
                  statusElement = <>⌛ Cancellation Requested</>;
                } else if (carrierRequestedOnly) {
                  statusElement = <>⚠️ Carrier Requested Cancellation</>;
                } else if (trip.carrierAccepted) {
                  statusElement = <>✅ Accepted by Carrier</>;
                } else {
                  statusElement = (
                    <>
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </>
                  );
                }

                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <TableData>{indexOfFirstTrip + idx + 1}</TableData>
                    <TableData>#{id}</TableData>
                    <TableData>{carrierName}</TableData>
                    <TableData>{source}</TableData>
                    <TableData>{destination}</TableData>
                    <TableData>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                          carrierCompleted
                            ? "bg-green-100 text-green-700"
                            : isTripCancelled
                            ? "bg-red-100 text-red-700"
                            : isCancelRequested
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {statusElement}
                      </span>
                    </TableData>
                    <TableData>
                      {carrierCompleted ? (
                        ratedTrips[id] ? (
                          <p className="text-sm text-green-600">
                            Thank you for your feedback!
                          </p>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <ReactStars
                              count={5}
                              value={ratings[id] || 0}
                              onChange={(newRating) =>
                                setRatings((prev) => ({
                                  ...prev,
                                  [id]: newRating,
                                }))
                              }
                              size={20}
                              color2={"#ffd700"}
                            />
                            <input
                              type="text"
                              value={feedbacks[id] || ""}
                              onChange={(e) =>
                                setFeedbacks((prev) => ({
                                  ...prev,
                                  [id]: e.target.value,
                                }))
                              }
                              placeholder="Leave feedback"
                              className="p-2 border rounded-md"
                            />
                            <button
                              onClick={() => submitRatingAndFeedback(id)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                            >
                              Submit
                            </button>
                          </div>
                        )
                      ) : (
                        <>
                          {!trip.paid && (
                            <PaymentButton
                              tripId={id}
                              amount={trip.amount}
                              senderEmail={senderEmail}
                              onSuccess={() => {
                                toast.success("Payment marked as done!");
                                fetchSelectedTrips();
                              }}
                            />
                          )}
                          {showCancelButton &&
                            new Date(trip.date) >= new Date() && (
                              <button
                                onClick={() => setCancelModalTripId(id)}
                                className="ml-4 text-sm text-red-600 hover:text-red-800"
                              >
                                Request Cancellation
                              </button>
                            )}

                          {carrierRequestedOnly && (
                            <button
                              onClick={() => setCancelActionModalTripId(id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Respond to Cancellation
                            </button>
                          )}
                          {isCancelRequested && (
                            <p className="text-sm text-yellow-600">
                              Waiting for carrier’s response
                            </p>
                          )}
                        </>
                      )}
                    </TableData>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center m-4">
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
          }
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Prev
        </button>
        <p className="text-sm text-gray-500 mx-4">
          Page {currentPage} of {totalPages||1}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Next
        </button>
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalTripId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Cancellation Request?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setCancelModalTripId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => confirmCancelTrip(cancelModalTripId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Respond to Cancellation Modal */}
      {cancelActionModalTripId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Carrier requested cancellation. Do you agree?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => acceptCancelTrip(cancelActionModalTripId)}
              >
                Yes, Accept
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => declineCancelTrip(cancelActionModalTripId)}
              >
                No, Decline
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableData = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    {children}
  </td>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </td>
  </tr>
);
