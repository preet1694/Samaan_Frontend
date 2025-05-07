import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import deliveryGIF from "../assets/delivery-1836.gif";

export const Hero = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#fffff] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Text Content */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block"
            >
              Ship your packages with
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="block text-indigo-600"
            >
              trusted travelers
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 text-lg text-gray-600 md:text-xl max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Connect with travelers heading to your destination. Save money and
            time by utilizing their extra luggage space.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link
              to="/search-carrier"
              className="px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg shadow-md transition transform hover:scale-105"
            >
              Find a Carrier
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium rounded-lg shadow-md transition transform hover:scale-105"
            >
              Become a Carrier
            </Link>
          </motion.div>
        </motion.div>

        {/* GIF Section */}
        <div className="hidden lg:block lg:w-1/2 lg:pl-12 mt-12 lg:mt-0">
          <div className="overflow-hidden rounded-2xl relative">
            <img
              src={deliveryGIF}
              alt="Package Delivery Animation"
              className="w-full object-cover"
              style={{
                objectPosition: "center",
                height: "auto",
                clipPath: "inset(20% 0 25% 0 round 12px)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
