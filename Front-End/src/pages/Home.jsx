import React from "react";
import { Globe, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 opacity-40 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 opacity-40 rounded-full blur-[130px] animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left max-w-2xl"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <span className="block">Ship your packages with</span>
            <span className="block text-indigo-600">trusted travelers</span>
          </motion.h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            Connect with travelers heading to your destination. Save money and
            time by utilizing their extra luggage space.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
            <motion.a
              href="/search-carrier"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg shadow-md transition"
            >
              Find a Carrier
            </motion.a>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium rounded-lg shadow-md transition"
            >
              Become a Carrier
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              A better way to ship your packages
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Global Network",
                desc: "Connect with travelers worldwide and find the perfect carrier for your package.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Secure Shipping",
                desc: "Our escrow system ensures your package and payment are protected throughout the journey.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Fast Delivery",
                desc: "Leverage existing travel plans for quick and efficient package delivery.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="p-6 rounded-2xl backdrop-blur-lg bg-white/70 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-indigo-500 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
