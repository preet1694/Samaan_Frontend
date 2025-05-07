import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Link2, Send } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-7 w-7" />,
    title: "Register",
    desc: "Sign up as a traveler or sender to get started with the platform.",
  },
  {
    icon: <Link2 className="h-7 w-7" />,
    title: "Connect",
    desc: "Browse or post trips to find a reliable match for your package or travel needs.",
  },
  {
    icon: <Send className="h-7 w-7" />,
    title: "Deliver",
    desc: "Meet up, hand over the package, and enjoy fast and secure delivery.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 sm:py-28 bg-[#fffff]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 sm:p-12 lg:p-20">
          {/* Heading */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold tracking-wide text-purple-800 uppercase">
              How It Works
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Send or Carry in Just a Few Steps
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  className="relative bg-white text-center px-8 py-10 rounded-2xl shadow-xl transition hover:shadow-2xl transform hover:-translate-y-1 w-full md:w-1/3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-14 h-14 mx-auto mt-2 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner border border-purple-200"
                  >
                    {step.icon}
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-gray-600">
                    {step.desc}
                  </p>
                </motion.div>

                {/* Vertical line after each step except the last (mobile only) */}
                {index < steps.length - 1 && (
                  <div className="block md:hidden w-1 h-10 bg-purple-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
