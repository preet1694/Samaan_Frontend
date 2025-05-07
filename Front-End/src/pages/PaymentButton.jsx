import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {baseURL} from "../config/AxiosHelper.jsx";

// Load Razorpay SDK
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const PaymentButton = ({ tripId, amount, senderEmail, onSuccess }) => {
    const handlePayment = async () => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error("Failed to load Razorpay script.");
            return;
        }

        try {
            // Create Razorpay order
            const { data: orderData } = await axios.post(
                `${baseURL}/payment/create-order/${tripId}`,
                { tripId, amount },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const { id: order_id, currency } = orderData;
            const razorpay_key= import.meta.env.VITE_RAZORPAY_KEY; // Replace with your actual Razorpay test/live key
            const options = {
                key: `${razorpay_key}`, // Replace with your actual Razorpay test/live key
                amount: amount * 100, // Razorpay takes amount in paisa
                currency,
                name: "Samaan Pooling",
                description: `Payment for Trip ID: ${tripId}`,
                order_id,
                handler: async function (response) {
                    try {
                        await axios.post(
                            `${baseURL}/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        toast.success("Payment successful!");
                        onSuccess?.(); // Optional callback
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
            Pay ₹{amount}
        </button>
    );
};

export default PaymentButton;
