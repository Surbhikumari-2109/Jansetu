import { useEffect, useState } from "react";
import { getMyComplaints }
from "../services/complaintService";
import { Link } from "react-router-dom";

const MyComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  useEffect(() => {
    const fetchComplaints =
      async () => {
        try {
          const token =
            localStorage.getItem("token");

          const data =
            await getMyComplaints(
              token
            );

          setComplaints(
            data.complaints
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchComplaints();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        My Complaints
      </h1>

     <div className="grid gap-4">

  {complaints.map((complaint) => (
    <Link
      to={`/complaints/${complaint._id}`}
      key={complaint._id}
      className="block bg-white border rounded-xl p-5 hover:shadow-md transition"
    >
      <h2 className="font-semibold">
        {complaint.title}
      </h2>

      <p className="text-slate-500 mt-2">
        {complaint.category}
      </p>

      <div className="mt-4">
        <span
          className="
            px-3
            py-1
            rounded-full
            bg-amber-100
            text-amber-700
            text-sm
          "
        >
          {complaint.status}
        </span>
      </div>
    </Link>
  ))}

</div>
    </div>
  );
};

export default MyComplaints;