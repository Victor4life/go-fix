import { useState, useEffect } from "react";
import StatsCard from "../../components/Stats/StatsCard";
import RequestTable from "../../components/Tables/RequestTable";
import DashboardHero from "../../components/Dashboard/DashboardHero";
import DashboardSideBar from "../../components/Dashboard/DashboardSideBar";
import { FaCheckCircle, FaDollarSign, FaUsers, FaTasks } from "react-icons/fa";

const ServiceSeekerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeServices: 0,
    completedServices: 0,
    totalEarnings: 0,
    totalClients: 0,
  });
  const [userData, setUserData] = useState({
    name: "",
    lastLogin: "",
    sessionTime: "",
    status: "active",
    profileImage: "",
  });
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // API calls to get provider's service data
      // const response = await api.getProviderServices();
      // Example API response structure:
      // {
      //   stats: { activeServices, completedServices, totalEarnings, totalClients },
      //   userData: { name, lastLogin, sessionTime, status, profileImage },
      //   requests: []
      // }
      // setStats(response.data.stats);
      // setUserData(response.data.userData);
      // setServiceRequests(response.data.requests);
    } catch (error) {
      setError("Failed to fetch service data. Please try again later.");
      console.error("Error fetching service data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Active Services",
      value: stats.activeServices,
      icon: <FaTasks />,
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Completed Services",
      value: stats.completedServices,
      icon: <FaCheckCircle />,
      color: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "Total Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: <FaUsers />,
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  ];
  if (error) {
    return (
      <div role="alert" className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button
            onClick={fetchServiceData}
            className="mt-2 text-sm font-semibold hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 -my-10 relative">
      {/* Mobile Menu Button*/}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar*/}
      <aside
        className={`
    fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg
    transition-transform duration-300 ease-in-out z-40
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <DashboardSideBar />
      </aside>

      {/* Main Content*/}
      <main
        className={`
    flex-1 relative overflow-y-auto scrollbar-hide
    ${isSidebarOpen ? "md:ml-0" : "md:ml-0"}
  `}
      >
        <div className="container px-4 md:px-8 lg:px-14 py-6 md:py-10 max-w-7xl mx-auto">
          {/* Header*/}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Dashboard
            </h2>
          </header>

          {/* Hero*/}
          <div className="mb-6">
            <DashboardHero userData={userData} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                textColor={stat.textColor}
              />
            ))}
          </div>
          {/* Service Requests Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Service Requests
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse text-gray-500">Loading...</div>
                </div>
              ) : serviceRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <RequestTable requests={serviceRequests} isProvider={true} />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No service requests found.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Reviews Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Recent Reviews
              </h2>
              <div className="text-center py-8 text-gray-500">
                <p>No reviews yet.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ServiceSeekerDashboard;
