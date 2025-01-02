import { useState, useEffect } from "react";
import StatsCard from "../../components/Stats/StatsCard";
import RequestTable from "../../components/Tables/RequestTable";

const ServiceSeekerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeServices: 0,
    completedServices: 0,
    totalEarnings: 0,
    totalClients: 0,
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
      // setStats(response.data.stats);
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
      icon: "active",
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Completed Services",
      value: stats.completedServices,
      icon: "completed",
      color: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "Total Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      icon: "money",
      color: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: "users",
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

  return (
    <main className="container mx-auto px-14 py-10 max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Dashboard</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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

      {/* Service Requests Table */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Service Requests
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
          ) : serviceRequests.length > 0 ? (
            <RequestTable
              requests={serviceRequests}
              isProvider={true} // Add this prop to handle provider-specific actions
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No service requests found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Reviews
          </h2>
          {/* Add reviews component here */}
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceSeekerDashboard;
