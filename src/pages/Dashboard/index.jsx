import { useAuth } from "../../context/AuthContext";
import ServiceProviderDashboard from "./ServiceProviderDashboard";
import ServiceSeekerDashboard from "./ServiceSeekerDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="my-10">
      {user.role === "provider" ? (
        <ServiceProviderDashboard />
      ) : (
        <ServiceSeekerDashboard />
      )}
    </div>
  );
};

export default Dashboard;
