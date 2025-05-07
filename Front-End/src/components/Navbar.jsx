import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = localStorage.getItem("name") || "User";
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    // localStorage.setItem("isAuthenticated", "false");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 rounded-lg mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Package className="h-8 w-8 text-indigo-600" />
              </motion.div>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-gray-800 tracking-tight"
              >
                Samaan
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            {localStorage.getItem("jwtToken") ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-gray-800 font-medium hover:text-indigo-600 transition text-base"
                >
                  <span>{userName}</span>
                  <User className="h-6 w-6 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-52 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      {userRole === "carrier" && (
                        <Link
                          to="/carrier/dashboard"
                          className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50"
                        >
                          Dashboard
                        </Link>
                      )}
                      {userRole === "sender" && (
                        <>
                          <Link
                            to="/sender/dashboard"
                            className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/search-carrier"
                            className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50"
                          >
                            Search Carrier
                          </Link>
                        </>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 text-base font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden px-4 pt-4 pb-3 space-y-2"
          >
            {localStorage.getItem("isAuthenticated") === "true" ? (
              <>
                {userRole === "carrier" && (
                  <Link
                    to="/carrier/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
                  >
                    Dashboard
                  </Link>
                )}
                {userRole === "sender" && (
                  <>
                    <Link
                      to="/sender/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/search-carrier"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
                    >
                      Search Carrier
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
