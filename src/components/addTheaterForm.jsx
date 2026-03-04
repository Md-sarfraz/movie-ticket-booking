import { useState } from "react";
import { myAxios } from "../services/helper";
import { toast } from "react-toastify";

export default function AddTheaterForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [theater, setTheater] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    postalCode: "",
    contactNo: "",
    capacity: "",
    screens: "",
    operatingHours: "",
  });

  const handleChange = (e) => {
    setTheater({ ...theater, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await myAxios.post("/theater/create", theater);

      if (response.status === 200) {
        toast.success("Theater added successfully!");
        setTheater({ 
          name: "", location: "", city: "", state: "", postalCode: "", 
          contactNo: "", capacity: "", screens: "", operatingHours: ""
        });
        // Call onSuccess callback if provided (for navigation)
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Failed to add theater.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theater Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Theater Name *
          </label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter theater name" 
            value={theater.name} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location *
          </label>
          <input 
            type="text" 
            name="location" 
            placeholder="Enter location/address" 
            value={theater.location} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input 
            type="text" 
            name="city" 
            placeholder="Enter city" 
            value={theater.city} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State *
          </label>
          <input 
            type="text" 
            name="state" 
            placeholder="Enter state" 
            value={theater.state} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code *
          </label>
          <input 
            type="text" 
            name="postalCode" 
            placeholder="Enter postal code" 
            value={theater.postalCode} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Number *
          </label>
          <input 
            type="tel" 
            name="contactNo" 
            placeholder="10-digit phone number" 
            value={theater.contactNo} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
            pattern="[0-9]{10}" 
            title="Enter a valid 10-digit number"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capacity *
          </label>
          <input 
            type="number" 
            name="capacity" 
            placeholder="Total seating capacity" 
            value={theater.capacity} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
            min="1"
          />
        </div>

        {/* Number of Screens */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Screens *
          </label>
          <input 
            type="number" 
            name="screens" 
            placeholder="Number of screens" 
            value={theater.screens} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
            min="1"
          />
        </div>

        {/* Operating Hours */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Operating Hours *
          </label>
          <input 
            type="text" 
            name="operatingHours" 
            placeholder="e.g., 10 AM - 10 PM" 
            value={theater.operatingHours} 
            onChange={handleChange} 
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required 
          />
        </div>

        {/* Action Buttons */}
        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={() => {
              setTheater({ 
                name: "", location: "", city: "", state: "", postalCode: "", 
                contactNo: "", capacity: "", screens: "", operatingHours: ""
              });
            }}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            className={`px-8 py-3 text-white rounded-lg font-semibold transition-colors ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`} 
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Theater"}
          </button>
        </div>
      </form>
    </div>
  );
}
