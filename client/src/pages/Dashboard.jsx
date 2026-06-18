import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        JanSetu Bihar
      </h1>

      <div className="flex gap-4">

        <Link
          to="/create-complaint"
          className="
            bg-indigo-600
            text-white
            px-5
            py-3
            rounded-xl
          "
        >
          Create Complaint
        </Link>

        <Link
          to="/my-complaints"
          className="
            bg-slate-800
            text-white
            px-5
            py-3
            rounded-xl
          "
        >
          My Complaints
        </Link>
     <Link
    to="/officer"
    className="
      bg-green-600
      text-white
      px-5
      py-3
      rounded-xl
    "
  >
    Officer Dashboard
  </Link>
      </div>
    </div>
  );
};

export default Dashboard;