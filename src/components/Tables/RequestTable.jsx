const RequestTable = ({ requests }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Service</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-t">
              <td className="px-6 py-4">{request.id}</td>
              <td className="px-6 py-4">{request.service}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default RequestTable;
