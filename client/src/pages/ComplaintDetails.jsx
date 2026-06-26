import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://jansetu-eta0.onrender.com/api/complaints/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setComplaint(res.data.complaint);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComplaint();
  }, [id]);

  if (!complaint) {
    return <div className="p-8">Loading...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link
        to="/my-complaints"
        className="
        inline-block
        text-indigo-600
        font-medium
        mb-4
      "
      >
        ← Back to My Complaints
      </Link>

      <h1 className="text-3xl font-bold mb-6">Complaint Details</h1>
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-gray-500">Complaint ID</p>
          <h2 className="font-semibold">{complaint.complaintId}</h2>
        </div>

        <div>
          <p className="text-gray-500">Title</p>
          <h2 className="font-semibold text-xl">{complaint.title}</h2>
        </div>

        <div>
          <p className="text-gray-500">Category</p>
          <p>{complaint.category}</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>

          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
            {complaint.status}
          </span>
        </div>

        <div>
          <p className="text-gray-500">Location</p>

          <p>
            {complaint.address}, {complaint.block}, {complaint.district}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Description</p>

          <p>{complaint.description}</p>
        </div>
        {complaint.images && complaint.images.length > 0 && (
          <div>
            <p className="text-gray-500 mb-3">Evidence Photos</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {complaint.images.map((image, index) => (
    <a
      key={index}
      href={image}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={image}
        alt={`Evidence ${index + 1}`}
        className="
          w-full
          h-48
          object-cover
          rounded-xl
          border
          shadow-sm
          hover:scale-105
          transition
          cursor-pointer
        "
      />
    </a>
  ))}
</div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Progress Timeline</h2>

        <div className="space-y-4">
          <div>✅ Complaint Submitted</div>

          <div>
            {["assigned", "in-progress", "resolved"].includes(complaint.status)
              ? "✅"
              : "⏳"}{" "}
            Assigned
          </div>

          <div>
            {["in-progress", "resolved"].includes(complaint.status)
              ? "✅"
              : "⏳"}{" "}
            In Progress
          </div>

          <div>{complaint.status === "resolved" ? "✅" : "⏳"} Resolved</div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
