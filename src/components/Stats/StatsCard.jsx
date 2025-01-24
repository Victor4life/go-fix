const StatsCard = ({ title, value, icon, color, textColor }) => {
  return (
    <div className={`p-6 rounded-lg shadow ${color}`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${textColor}`}>{icon}</div>
        <div className="ml-4">
          <h3 className={`text-sm ${textColor}`}>{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
