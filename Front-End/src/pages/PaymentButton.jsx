import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper.jsx";

// Load Razorpay SDK
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const PaymentButton = ({ tripId, senderEmail, onSuccess }) => {
    const handlePayment = async () => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error("Failed to load Razorpay script.");
            return;
        }

        try {
            const { data: orderData } = await axios.post(
                `${baseURL}/payment/create-order/${tripId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const options = {
                key: orderData.key,                  // ✅ Use key from backend
                amount: orderData.amount,            // ✅ Use amount from backend
                currency: orderData.currency,
                name: "Samaan Pooling",
                description: `Payment for Trip ID: ${tripId}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        await axios.post(
                            `${baseURL}/payment/verify`,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                tripId: tripId, // keep this as is
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
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
            Pay Now
        </button>
    );
};

export default PaymentButton;
