import { useState, useRef } from "react";
import axios from "axios";
const CreateComplaint = () => {
  const fileInputRef = useRef(null); 
  const [images, setImages] = useState([]); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    block: "",
    ward: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleImageChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);

  //   setImages((prev) => [...prev, ...selectedFiles]);
  // };

  // const removeImage = (indexToRemove) => {
  //   setImages(
  //     images.filter(
  //       (_, index) => index !== indexToRemove
  //     )
  //   );
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      const data = new FormData();

      data.append("title", formData.title);
      data.append(
        "description",
        formData.description
      );
      data.append(
        "category",
        formData.category
      );
      data.append(
        "district",
        formData.district
      );
      data.append("block", formData.block);
      data.append("ward", formData.ward);
      data.append(
        "address",
        formData.address
      );
      data.append(
        "latitude",
        formData.latitude
      );
      data.append(
        "longitude",
        formData.longitude
      );

      for (
        let i = 0;
        i < images.length;
        i++
      ) {
        data.append(
          "images",
          images[i]
        );
      }

      const response = await axios.post(
        "http://localhost:5000/api/complaints/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Complaint Created!");

      console.log(response.data);

      setFormData({
        title: "",
        description: "",
        category: "",
        district: "",
        block: "",
        ward: "",
        address: "",
        latitude: "",
        longitude: "",
      });

      setImages([]);
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Report Civic Issue
      </h1>

      <p className="text-slate-500 mb-8">
        Help improve your locality by
        reporting civic problems.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-5"
      >
        <input
          type="text"
          name="title"
          placeholder="Issue Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        />

        <textarea
          name="description"
          placeholder="Describe the issue"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl h-32"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
          required
        >
          <option value="">
            Select Category
          </option>

          <option>Road Damage</option>
          <option>
            Garbage Collection
          </option>
          <option>
            Street Light Issue
          </option>
          <option>
            Water Leakage
          </option>
          <option>
            Drainage Problem
          </option>
          <option>
            Illegal Construction
          </option>
          <option>
            Public Toilet Issue
          </option>
          <option>
            Stray Animals
          </option>
          <option>
            Pollution Complaint
          </option>
        </select>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="block"
            placeholder="Block"
            value={formData.block}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="ward"
            placeholder="Ward"
            value={formData.ward}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
        </div>

      <div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Upload Evidence Photos
  </label>

  <p className="text-sm text-slate-500 mb-3">
    Maximum 3 images allowed.
  </p>

  <input
    ref={fileInputRef}
    type="file"
    multiple
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const selectedFiles = Array.from(e.target.files);

      if (
        images.length + selectedFiles.length >
        3
      ) {
        alert("Maximum 3 images allowed");
        return;
      }

      setImages((prev) => [
        ...prev,
        ...selectedFiles,
      ]);

      e.target.value = "";
    }}
  />

  <button
    type="button"
    onClick={() =>
      fileInputRef.current.click()
    }
    className="
      w-full
      border-2
      border-dashed
      border-slate-300
      rounded-xl
      py-3
      text-slate-600
      hover:border-indigo-500
      hover:text-indigo-600
      transition
    "
  >
    <div className="flex items-center justify-center gap-2">
      <span>📷</span>
      <span>
        Upload Images (Max 3)
      </span>
    </div>
  </button>

  {images.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {images.map((file, index) => (
        <div
          key={index}
          className="
            relative
            border
            rounded-xl
            overflow-hidden
            shadow-sm
          "
        >
          <img
            src={URL.createObjectURL(file)}
            alt=""
            className="h-32 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => {
              const updated =
                images.filter(
                  (_, i) =>
                    i !== index
                );

              setImages(updated);

              if (
                updated.length === 0
              ) {
                fileInputRef.current.value =
                  "";
              }
            }}
           className="
absolute
top-2
right-2
w-7
h-7
flex
items-center
justify-center
bg-white/90
text-red-500
rounded-full
shadow
hover:bg-red-500
hover:text-white
transition
"
          >
            ✕
          </button>

          <div className="p-2 text-xs truncate">
            {file.name}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;