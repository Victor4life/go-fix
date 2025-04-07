import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, reAuthenticate, updateUserRole } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown menu and its button
      if (isWhatWeDoOpen && !event.target.closest(".relative")) {
        setIsWhatWeDoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWhatWeDoOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleReAuthenticate = async () => {
    const result = await reAuthenticate();
    if (result.success) {
      closeMenus();
      alert("Re-authentication successful");
    } else {
      alert("Re-authentication failed: " + (result.error || "Unknown error"));
    }
  };

  const handleRoleUpdate = async () => {
    const result = await updateUserRole("provider");
    if (result.success) {
      closeMenus();
      alert("Role updated to provider successfully");
      navigate("/dashboard");
    } else {
      alert("Role update failed: " + (result.error || "Unknown error"));
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsWhatWeDoOpen(false);
  };

  const getProfileLink = () => {
    if (!user) return null;
    return `/profile/${user.role || "provider"}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-sm my-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center" onClick={closeMenus}>
            <span className="text-2xl font-bold text-gray-700 ml-2">GoFix</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "text-blue-700" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            {/* Find Services Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={() => setIsWhatWeDoOpen(!isWhatWeDoOpen)}
              >
                Find Services
              </button>
              {/* Dropdown Menu */}
              {isWhatWeDoOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/services"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsWhatWeDoOpen(false);
                        closeMenus();
                      }}
                    >
                      All Services
                    </Link>
                    <Link
                      to="/search-map"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsWhatWeDoOpen(false);
                        closeMenus();
                      }}
                    >
                      Search with Map
                    </Link>
                    <Link
                      to="/post-job"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsWhatWeDoOpen(false);
                        closeMenus();
                      }}
                    >
                      Post a Job
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `relative text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "text-blue-700" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Blog
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "text-blue-700" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Contact
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            {user ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none ring-1 ring-offset-1 ring-blue-500 focus:ring-2 focus:ring-offset-2"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.name ? user.name[0].toUpperCase() : <FaUser />}
                    </div>
                  </button>
                </div>
                {/* Desktop Dropdown Menu */}
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeMenus}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={getProfileLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeMenus}
                      >
                        Profile
                      </Link>
                      {/*<button
                        onClick={handleReAuthenticate}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Re-authenticate
                      </button>
                      {user && user.role !== "provider" && (
                        <button
                          onClick={handleRoleUpdate}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Become Provider
                        </button>
                      )}*/}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md border-2 border-blue-400 hover:bg-blue-600 transition-colors text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-md shadow-md">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={closeMenus}
          >
            Home
          </Link>
          {/* Find Services Section */}
          <div className="px-3 py-2 text-base font-medium text-gray-700">
            Find Services
          </div>
          <div className="pl-6">
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenus}
            >
              All Services
            </Link>
            <Link
              to="/search-map"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenus}
            >
              Search with Map
            </Link>
            <Link
              to="/post-job"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenus}
            >
              Post a Job
            </Link>
          </div>

          <Link
            to="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={closeMenus}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={closeMenus}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={closeMenus}
              >
                Dashboard
              </Link>
              <Link
                to={getProfileLink()}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={closeMenus}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="space-y-2 px-3">
              <Link
                to="/login"
                className="block text-center text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md transition-colors text-base font-medium"
                onClick={closeMenus}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md border-2 border-blue-400 hover:bg-blue-600 transition-colors text-base font-medium"
                onClick={closeMenus}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
