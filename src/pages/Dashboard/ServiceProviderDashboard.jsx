import { useState, useEffect } from "react";
import StatsCard from "../../components/Stats/StatsCard";
import RequestTable from "../../components/Tables/RequestTable";

const ServiceProviderDashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeRequests: 0,
    completedJobs: 0,
    earnings: 0,
  });

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // API calls to get dashboard data
      // setStats(response.data.stats);
      // setRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-18 relative">
      <h1 className="text-3xl font-bold mb-6">Service Provider Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Services"
          value={stats.totalServices}
          icon="services"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.activeRequests}
          icon="pending"
        />
        <StatsCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon="completed"
        />
        <StatsCard
          title="Total Earnings"
          value={`#${stats.earnings}`}
          icon="earnings"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
        <RequestTable requests={requests} />
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
