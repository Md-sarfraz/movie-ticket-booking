import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Film, ChevronRight, Info } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const BookTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SAFE movie access
  const movie = location.state?.data;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [theaters, setTheaters] = useState([]);

  // ✅ STOP CRASH IF MOVIE IS MISSING
  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Movie data not found. Please go back and select a movie.
      </div>
    );
  }

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !movie?.movieId) return;

      const response = await axios.get(
        `http://localhost:1111/api/theater/by-movie/${movie.movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTheaters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  // ✅ SAFE EFFECT
  useEffect(() => {
    if (movie?.movieId) {
      fetchTheaters();
    }
  }, [movie]);

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
    setSelectedTime(null);
  };

  const handleContinue = () => {
    if (!selectedTheater || !selectedTime) return;

    navigate("/seatSelection", {
      state: {
        movie,
        theater: selectedTheater,
        time: selectedTime,
        date: selectedDate,
      },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      {/* Hero */}
      <div className="relative w-full h-64 md:h-96">
        <img
          src={movie.backgroundImageUrl || "/fallback.jpg"}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-6 flex flex-col justify-end">
          <div className="flex items-center">
            <Film className="text-red-500 mr-2" size={20} />
            <span className="text-gray-300 text-sm">{movie.genre}</span>
          </div>
          <h1 className="text-white text-3xl font-bold">{movie.title}</h1>
          <div className="flex gap-4 mt-2">
            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">
              {movie.rating}
            </span>
            <span className="text-gray-300 flex items-center">
              <Clock size={16} className="mr-1" />
              {movie.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Booking */}
      <div className="max-w-4xl mx-auto bg-white mt-6 rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold">Book Tickets</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-red-500 flex items-center text-sm"
            >
              <Info size={16} className="mr-1" />
              Movie Details
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p className="mb-2">{movie.description}</p>
              <p><b>Director:</b> {movie.director}</p>
              <p><b>Release:</b> {movie.releaseDate}</p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <Calendar className="text-red-500 mr-2" />
              Select Date
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {getNextDays().map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`py-3 rounded ${
                    isSameDay(selectedDate, date)
                      ? "bg-red-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="text-xs">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="font-bold">{date.getDate()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theaters */}
        <div className="border-t">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleTheaterSelect(theater)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{theater.name}</h3>
                <ChevronRight />
              </div>

              {selectedTheater?.id === theater.id && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {theater.time?.map((time) => (
                    <button
                      key={time}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTime(time);
                      }}
                      className={`px-3 py-2 rounded ${
                        selectedTime === time
                          ? "bg-red-500 text-white"
                          : "border"
                      }`}
                    >
                      <Clock size={14} className="inline mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue */}
      <div className="flex justify-center my-8">
        <button
          disabled={!selectedTheater || !selectedTime}
          onClick={handleContinue}
          className={`px-8 py-3 rounded text-white font-semibold ${
            selectedTheater && selectedTime
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue to Seats <ChevronRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
};

export default BookTickets;
