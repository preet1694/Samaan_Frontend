import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance, { baseURL } from "../config/AxiosHelper.jsx";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentButton = ({ tripId, senderEmail, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay script.");
      setLoading(false);
      return;
    }

    try {
      const { data: orderData } = await axiosInstance.post(
        `${baseURL}/payment/create-order/${tripId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Samaan Pooling",
        description: `Payment for Trip ID: ${tripId}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            await axiosInstance.post(
              `${baseURL}/payment/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                tripId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            toast.success("Payment successful!");
            onSuccess?.();
          } catch (error) {
            toast.error("Payment verification failed.");
            console.error("Verification error:", error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: senderEmail,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Error while initiating payment.");
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;
