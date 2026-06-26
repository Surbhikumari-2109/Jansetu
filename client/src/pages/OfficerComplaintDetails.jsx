import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OfficerComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] =
    useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchComplaint =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setComplaint(
            res.data.complaint
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchComplaint();
  }, [id]);

  if (!complaint) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
  <div className="max-w-7xl mx-auto p-6">

    <Link
      to="/officer"
      className="text-indigo-600 font-medium"
    >
      ← Back to Dashboard
    </Link>

    <div className="flex justify-between items-center mt-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manage Complaint
        </h1>

        <p className="text-slate-500 mt-1">
          {complaint.complaintId}
        </p>
      </div>

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-orange-100
          text-orange-700
          font-medium
        "
      >
        {complaint.status}
      </span>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">

      {/* LEFT SIDE */}

      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold mb-4">
            Complaint Information
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-slate-500 text-sm">
                Title
              </p>

              <p className="font-medium">
                {complaint.title}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Category
              </p>

              <p>
                {complaint.category}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Description
              </p>

              <p>
                {complaint.description}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold mb-4">
            Location Information
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Address:</strong>{" "}
              {complaint.address}
            </p>

            <p>
              <strong>Block:</strong>{" "}
              {complaint.block}
            </p>

            <p>
              <strong>District:</strong>{" "}
              {complaint.district}
            </p>

            <p>
              <strong>Ward:</strong>{" "}
              {complaint.ward}
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold mb-4">
            Photo Evidence
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {complaint.images?.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className="
                    h-32
                    w-full
                    object-cover
                    rounded-xl
                    border
                    cursor-pointer
                    hover:scale-105
                    transition
                  "
                />
              )
            )}

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="space-y-6">

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="font-semibold mb-4">
            Complaint Summary
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              <strong>ID:</strong>{" "}
              {complaint.complaintId}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {complaint.status}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {complaint.priority}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(
                complaint.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">

            <button
              className="
                w-full
                bg-blue-600
                text-white
                py-3
                rounded-xl
              "
            >
              Assign Worker
            </button>

            <button
              className="
                w-full
                bg-orange-500
                text-white
                py-3
                rounded-xl
              "
            >
              Update Status
            </button>

            <button
              className="
                w-full
                bg-green-600
                text-white
                py-3
                rounded-xl
              "
            >
              Mark Resolved
            </button>

          </div>

        </div>

      </div>

    </div>

    {selectedImage && (
      <div
        onClick={() =>
          setSelectedImage(null)
        }
        className="
          fixed
          inset-0
          bg-black/80
          flex
          items-center
          justify-center
          z-50
          p-4
        "
      >
        <img
          src={selectedImage}
          alt=""
          className="
            max-w-full
            max-h-[90vh]
            rounded-2xl
          "
        />
      </div>
    )}

  </div>
);
};

export default OfficerComplaintDetails;