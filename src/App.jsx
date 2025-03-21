import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// Page imports
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import ServiceProviderProfile from "./pages/Profiles/ServiceProviderProfile";
import ServiceSeekerProfile from "/pages/Profiles/ServiceSeekerProfile";
import Services from "./pages/Service";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Settings from "./pages/Settings";
import BlogPost from "./pages/Blog/BlogPost";

// Create a new component for the profile redirect
function ProfileRedirect() {
  const { userType } = useAuth();
  return (
    <Navigate
      to={userType === "provider" ? "/profile/provider" : "/profile/seeker"}
      replace
    />
  );
}

function App() {
  const location = useLocation();

  const noNavFooterPaths = [
    "/login",
    "/signup",
    "/dashboard",
    "/profile/provider",
    "/profile/seeker",
    "/profile/user",
    "/settings",
  ];

  const shouldHideNavFooter = noNavFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        {!shouldHideNavFooter && <NavBar />}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/*Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Profile Routes */}
            <Route
              path="/profile/*"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <Routes>
                      <Route
                        path="provider"
                        element={<ServiceProviderProfile />}
                      />
                      <Route path="seeker" element={<ServiceSeekerProfile />} />
                      {/* Using the new ProfileRedirect component */}
                      <Route path="user" element={<ProfileRedirect />} />
                    </Routes>
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                      The page you're looking for doesn't exist.
                    </p>
                    <a
                      href="/"
                      className="text-blue-500 hover:text-blue-600 underline"
                    >
                      Go back home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        {!shouldHideNavFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
