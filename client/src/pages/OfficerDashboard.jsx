import { useEffect, useState } from "react";
import axios from "axios";

const OfficerDashboard = () => {
  const [complaints, setComplaints] =
    useState([]);

  const fetchComplaints = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/complaints/my-complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(
        res.data.complaints
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Officer Dashboard
      </h1>

      <div className="space-y-4">

        {complaints.map(
          (complaint) => (
            <div
              key={complaint._id}
              className="
              bg-white
              border
              rounded-xl
              p-5
            "
            >
              <h2 className="font-semibold">
                {complaint.title}
              </h2>

              <p>
                {complaint.category}
              </p>

              <p className="mt-2">
                Status:
                {" "}
                {complaint.status}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">

                <button
                  onClick={() =>
                    updateStatus(
                      complaint._id,
                      "assigned"
                    )
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Assign
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      complaint._id,
                      "in-progress"
                    )
                  }
                  className="bg-orange-500 text-white px-3 py-1 rounded"
                >
                  In Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      complaint._id,
                      "resolved"
                    )
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Resolve
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
};

export default OfficerDashboard;