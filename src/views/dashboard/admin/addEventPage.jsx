import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2, MapPin, Plus, Ticket } from "lucide-react";
import { createEvent } from "@/services/event-service";

const initialForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  price: "",
  description: "",
};

const AddEventPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !backgroundImageFile) {
      alert("Please upload both event image and background image.");
      return;
    }

    setSubmitting(true);
    try {
      await createEvent(form, imageFile, backgroundImageFile);
      alert("Event created successfully");
      navigate("/adminDashboard/eventList");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate("/adminDashboard/eventList")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4"
        >
          <ArrowLeft size={18} /> Back to Event List
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">Add <span className="text-red-500">Event</span></h1>
        <p className="text-sm text-gray-500 mb-6">Create a new event with cover and background media</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input name="category" value={form.category} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Calendar size={14} /> Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input name="time" value={form.time} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="7:30 PM" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><MapPin size={14} /> Location</label>
              <input name="location" value={form.location} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Ticket size={14} /> Price</label>
              <input name="price" value={form.price} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="₹499 onwards" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Event Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              <input type="file" accept="image/*" onChange={(e) => setBackgroundImageFile(e.target.files?.[0] || null)} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
