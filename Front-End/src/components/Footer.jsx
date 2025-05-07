import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-gray-900 text-white pt-10 pb-6"
    >
      {/* Gradient Blur */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-75"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Info */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-m text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">Samaan</span>. All Rights
            Reserved.
          </p>
          
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-gray-400">
          <a
            href="https://github.com/preet1694/Samaan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github className="h-7 w-7" />
          </a>
          <a
            href="mailto:preet.brahmbhatt16@gmail.com"
            className="hover:text-white transition"
          >
            <Mail className="h-7 w-7" />
          </a>
          <a
            href="https://linkedin.com/in/preet-brahmbhatt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin className="h-7 w-7" />
          </a>
          <a
            href="https://www.linkedin.com/in/vraj-ranipa-3ba173265?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BoZsioJXHQFav24sFarHz8Q%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin className="h-7 w-7" />
          </a>
        </div>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition shadow-md"
          title="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </motion.footer>
  );
};

export default Footer;
