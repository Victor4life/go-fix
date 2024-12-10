// src/pages/Dashboard/ServiceSeekerDashboard.jsx
import { useState, useEffect } from "react";
import StatsCard from "../../components/Stats/StatsCard";
import RequestTable from "../../components/Tables/RequestTable";

const ServiceSeekerDashboard = () => {
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedRequests: 0,
    totalSpent: 0,
  });

  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      // API calls to get user's requests
      // setStats(response.data.stats);
      // setMyRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Service Requests</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active Requests"
          value={stats.activeRequests}
          icon="active"
        />
        <StatsCard
          title="Completed"
          value={stats.completedRequests}
          icon="completed"
        />
        <StatsCard
          title="Total Spent"
          value={`#${stats.totalSpent}`}
          icon="money"
        />
      </div>

      {/* My Requests Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        <RequestTable requests={myRequests} />
      </div>
    </div>
  );
};

export default ServiceSeekerDashboard;
