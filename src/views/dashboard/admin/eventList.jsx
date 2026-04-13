import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Plus, Ticket } from "lucide-react";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import SearchBar from "@/components/searchbar";
import ConfirmationCard from "@/components/confirmationCard";
import { deleteEvent, getAllEvents } from "@/services/event-service";

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const eventsPerPage = 8;

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.category, event.location]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [events, searchTerm]);

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const confirmDelete = (event) => {
    setSelectedEvent(event);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent?.id) {
      return;
    }

    try {
      await deleteEvent(selectedEvent.id);
      setShowConfirm(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Event<span className="text-red-500">List</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and view all events ({filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"})
            </p>
          </div>
          <button
            onClick={() => navigate("/adminDashboard/addEvent")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg w-fit"
          >
            <Plus size={18} />
            Add New Event
          </button>
        </div>

        <SearchBar
          className="w-full"
          placeholder="Search by title, category, or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {showConfirm && (
        <ConfirmationCard
          message={`Are you sure you want to delete "${selectedEvent?.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-52 overflow-hidden group">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-3">
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                      onClick={() => confirmDelete(event)}
                      title="Delete Event"
                    >
                      <RiDeleteBin6Line className="text-lg" />
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      onClick={() => navigate(`/adminDashboard/editEvent/${event.id}`)}
                      title="Edit Event"
                    >
                      <RiEdit2Line className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{event.title}</h2>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><Ticket size={14} /> {event.category}</p>
                  <p className="flex items-center gap-2"><Calendar size={14} /> {event.date} • {event.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} /> {event.location}</p>
                </div>
                <p className="mt-3 text-red-600 font-semibold">{event.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Ticket size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              {events.length === 0 ? "No events available" : "No events found matching your search"}
            </p>
          </div>
        )}
      </div>

      {filteredEvents.length > eventsPerPage && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-lg transition-all font-medium ${
                    currentPage === page ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
