import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2, MapPin, Save, Ticket } from "lucide-react";
import { getEventById, updateEvent } from "@/services/event-service";

const EditEventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [form, setForm] = useState({
    id: null,
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    price: "",
    description: "",
    imageUrl: "",
    backgroundImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(eventId);
        setForm({
          id: data.id,
          title: data.title || "",
          category: data.category || "",
          date: data.date || "",
          time: data.time || "",
          location: data.location || "",
          price: data.price || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          backgroundImageUrl: data.backgroundImageUrl || "",
        });
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to load event");
        navigate("/adminDashboard/eventList");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEvent(eventId, form, imageFile, backgroundImageFile);
      alert("Event updated successfully");
      navigate("/adminDashboard/eventList");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={28} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        <button
          onClick={() => navigate("/adminDashboard/eventList")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4"
        >
          <ArrowLeft size={18} /> Back to Event List
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Edit <span className="text-red-500">Event</span></h1>
        <p className="text-sm text-gray-500 mb-6">Update event details and optionally replace images</p>

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
              <input name="time" value={form.time} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><MapPin size={14} /> Location</label>
              <input name="location" value={form.location} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Ticket size={14} /> Price</label>
              <input name="price" value={form.price} onChange={handleChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} required className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Replace Event Image (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1 w-full border rounded-lg px-3 py-2" />
              {form.imageUrl && <img src={form.imageUrl} alt="Event" className="mt-2 w-32 h-20 object-cover rounded" />}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Replace Background Image (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setBackgroundImageFile(e.target.files?.[0] || null)} className="mt-1 w-full border rounded-lg px-3 py-2" />
              {form.backgroundImageUrl && <img src={form.backgroundImageUrl} alt="Background" className="mt-2 w-32 h-20 object-cover rounded" />}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
