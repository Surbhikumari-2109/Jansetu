import { useState, useRef } from "react";
import axios from "axios";
import { 
  Car, 
  Trash2, 
  Lightbulb, 
  Droplet, 
  TriangleAlert, 
  Building, 
  Siren, 
  Bone, 
  CloudRain,
  Camera
} from "lucide-react";

// CATEGORY ARRAY UPDATED WITH PROFESSIONAL LUCIDE REACT ICONS
const categories = [
  { name: "Road Damage", icon: <Car className="h-6 w-6 mx-auto" /> },
  { name: "Garbage Collection", icon: <Trash2 className="h-6 w-6 mx-auto" /> },
  { name: "Street Light Issue", icon: <Lightbulb className="h-6 w-6 mx-auto" /> },
  { name: "Water Leakage", icon: <Droplet className="h-6 w-6 mx-auto" /> },
  { name: "Drainage Problem", icon: <TriangleAlert className="h-6 w-6 mx-auto" /> },
  { name: "Illegal Construction", icon: <Building className="h-6 w-6 mx-auto" /> },
  { name: "Public Toilet Issue", icon: <Siren className="h-6 w-6 mx-auto" /> },
  { name: "Stray Animals", icon: <Bone className="h-6 w-6 mx-auto" /> },
  { name: "Pollution Complaint", icon: <CloudRain className="h-6 w-6 mx-auto" /> },
];

const CreateComplaint = () => {
  const fileInputRef = useRef(null); 
  const [images, setImages] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (categoryName) => {
    setFormData({ ...formData, category: categoryName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category from the grid.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await axios.post(
        "https://jansetu-eta0.onrender.com/api/complaints/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg("Complaint successfully registered! Track its status in your dashboard.");
      
      // Reset form
      setFormData({
        title: "", description: "", category: "", district: "",
        block: "", ward: "", address: "", latitude: "", longitude: "",
      });
      setImages([]);

    } catch (error) {
      console.log(error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-slate-900 pb-12 pt-6 sm:pt-12">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">📋 Submit New Complaint</h1>
        <p className="text-slate-500 font-medium">Report a civic issue in your ward and get it fixed fast.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex items-center gap-2 shadow-sm">
          ✅ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* CATEGORY GRID */}
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
            Select Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  formData.category === cat.name
                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-orange-200 hover:bg-white"
                }`}
              >
                <span className="block text-2xl mb-1">{cat.icon}</span>
                <span className="text-sm font-bold leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            Issue Details
          </label>
          <input
            type="text"
            name="title"
            placeholder="Complaint Title (e.g., Deep pothole near Bus Stand)"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            required
          />
          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium h-32 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-y"
            required
          />
        </div>

        {/* LOCATION DETAILS */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            Location Information
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" required />
            <input type="text" name="block" placeholder="Block" value={formData.block} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" required />
            <input type="text" name="ward" placeholder="Ward No. / Area" value={formData.ward} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" required />
            <input type="text" name="address" placeholder="Nearest Landmark or Address" value={formData.address} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" required />
            <input type="number" step="any" name="latitude" placeholder="Latitude (Optional)" value={formData.latitude} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
            <input type="number" step="any" name="longitude" placeholder="Longitude (Optional)" value={formData.longitude} onChange={handleChange} className="border border-slate-200 bg-slate-50 p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
          </div>
        </div>

        {/* PHOTO EVIDENCE */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            Photo Evidence (Max 3)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files);
              if (images.length + selectedFiles.length > 3) {
                alert("Maximum 3 images allowed");
                return;
              }
              setImages((prev) => [...prev, ...selectedFiles]);
              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 rounded-xl py-8 text-slate-500 hover:text-orange-600 transition-all focus:outline-none group"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Camera className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Click to upload photos (JPG, PNG)</span>
            </div>
          </button>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative border border-slate-200 rounded-xl overflow-hidden shadow-sm group">
                  <img src={URL.createObjectURL(file)} alt="Evidence preview" className="h-32 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = images.filter((_, i) => i !== index);
                      setImages(updated);
                      if (updated.length === 0) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white text-slate-900 rounded-full shadow-md font-bold hover:bg-red-500 hover:text-white transition-all opacity-90 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-md transition-all ${
            isSubmitting 
              ? "bg-slate-400 cursor-not-allowed" 
              : "bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg"
          }`}
        >
          {isSubmitting ? "Uploading..." : " Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;