import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Film, ChevronRight, Info, Ticket } from "lucide-react";
import { myAxios } from "../services/helper";
import { getShowsByMovie, getAvailableDates } from "../services/showService";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BookTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCity = useSelector((state) => state.city.selectedCity);

  console.log("========================================");
  console.log("🎫 BookTickets Component Loaded");
  console.log("   selectedCity from Redux:", selectedCity);
  console.log("   selectedCity type:", typeof selectedCity);
  console.log("========================================");

  // ✅ SAFE movie access
  const movie = location.state?.data;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [shows, setShows] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [groupedShows, setGroupedShows] = useState({});

  // ✅ STOP CRASH IF MOVIE IS MISSING
  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Movie data not found. Please go back and select a movie.
      </div>
    );
  }

  // Fetch shows for the selected movie, city, and date
  const fetchShows = async () => {
    try {
      if (!movie?.movieId) {
        console.warn("⚠️ No movieId found:", movie);
        return;
      }

      console.log("========================================");
      console.log("🎬 fetchShows() called");
      console.log("   movie.movieId:", movie.movieId);
      console.log("   selectedCity:", selectedCity);
      console.log("   selectedCity type:", typeof selectedCity);
      console.log("   selectedDate:", selectedDate);
      console.log("========================================");
      
      // Format date as YYYY-MM-DD using local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      console.log("📅 Formatted date:", formattedDate);
      
      const showsData = await getShowsByMovie(
        movie.movieId, 
        selectedCity || null, // Pass null if no city selected to get all shows
        formattedDate
      );

      console.log("🎭 Shows response:", showsData);
      console.log("🎭 Number of shows:", showsData?.length || 0);
      
      const showsArray = Array.isArray(showsData) ? showsData : [];
      setShows(showsArray);
      
      // Group shows by theater
      const grouped = showsArray.reduce((acc, show) => {
        const theaterId = show.theater?.id || show.theater?.theaterId;
        if (!acc[theaterId]) {
          acc[theaterId] = {
            theater: show.theater,
            shows: []
          };
        }
        acc[theaterId].shows.push(show);
        return acc;
      }, {});
      
      setGroupedShows(grouped);
      console.log("🎭 Grouped shows:", grouped);
      console.log("🎭 Number of theaters:", Object.keys(grouped).length);
    } catch (error) {
      console.error("❌ Error fetching shows:", error);
      console.error("❌ Error details:", error.response?.data);
      setShows([]);
      setGroupedShows({});
    }
  };

  // Fetch available dates for date picker
  const fetchAvailableDates = async () => {
    try {
      if (!movie?.movieId) return;
      
      const dates = await getAvailableDates(movie.movieId, selectedCity || null);
      setAvailableDates(dates.map(d => new Date(d)));
      console.log("📅 Available dates:", dates);
      console.log("📅 Number of available dates:", dates.length);
    } catch (error) {
      console.error("❌ Error fetching dates:", error);
      setAvailableDates([]);
    }
  };

  // ✅ SAFE EFFECT
  useEffect(() => {
    if (movie?.movieId) {
      fetchAvailableDates();
    }
  }, [movie, selectedCity]);

  useEffect(() => {
    if (movie?.movieId && selectedDate) {
      fetchShows();
      // Reset selections when date changes
      setSelectedShow(null);
      setSelectedTheater(null);
    }
  }, [movie, selectedCity, selectedDate]);

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) { // Extended to 14 days
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

  const hasShowsOnDate = (date) => {
    return availableDates.some(availDate => isSameDay(availDate, date));
  };

  const handleTheaterSelect = (theaterId) => {
    setSelectedTheater(theaterId);
    setSelectedShow(null);
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
  };

  const handleContinue = () => {
    if (!selectedShow) return;

    navigate("/seatSelection", {
      state: {
        movie,
        show: selectedShow,
        theater: selectedShow.theater,
        time: selectedShow.showTime,
        date: selectedDate.toLocaleDateString("en-US", {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
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
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Book Tickets</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-red-500 flex items-center text-sm"
            >
              <Info size={16} className="mr-1" />
              Movie Details
            </button>
          </div>

          {/* City Filter Info */}
          {selectedCity && (
            <div className="mt-3 flex items-center gap-2 text-sm bg-red-50 p-3 rounded-lg">
              <MapPin size={16} className="text-red-500" />
              <span className="text-gray-700">
                Showing theaters in <span className="font-semibold text-red-600">{selectedCity}</span>
              </span>
            </div>
          )}
          
          {!selectedCity && (
            <div className="mt-3 flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-lg">
              <MapPin size={16} className="text-blue-600" />
              <span className="text-gray-700">
                Showing theaters from all cities. Select a city from the navigation bar to filter.
              </span>
            </div>
          )}

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
              Select Date (Next 14 Days)
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-7 gap-2 min-w-max sm:min-w-0">
                {getNextDays().map((date, i) => {
                const hasShows = hasShowsOnDate(date);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`py-3 rounded relative ${
                      isSameDay(selectedDate, date)
                        ? "bg-red-500 text-white"
                        : hasShows
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <div className="text-xs">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="font-bold">{date.getDate()}</div>
                    {hasShows && !isSameDay(selectedDate, date) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            </div>
          </div>
        </div>

        {/* Theaters and Shows */}
        <div className="border-t">
          {Object.keys(groupedShows).length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <MapPin className="inline-block mb-2" size={32} />
              <p className="font-semibold">No shows available</p>
              {selectedCity && (
                <div className="mt-2">
                  <p className="text-sm">
                    for {movie.title} in <span className="font-bold text-red-600">{selectedCity}</span> on{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> Try selecting a different city or remove city filter to see all available shows.
                    </p>
                  </div>
                </div>
              )}
              {!selectedCity && (
                <p className="text-sm mt-2">
                  for {movie.title} on{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              <p className="text-xs mt-4 text-gray-400">
                Open Console (F12) to see detailed debugging information
              </p>
            </div>
          ) : (
            Object.entries(groupedShows).map(([theaterId, { theater, shows }]) => (
              <div
                key={theaterId}
                className="px-6 py-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => handleTheaterSelect(theaterId)}
                >
                  <div>
                    <h3 className="font-medium">{theater.name}</h3>
                    {theater.city && (
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin size={12} className="mr-1" />
                        {theater.city}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {shows.length} show{shows.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <ChevronRight className={`transition-transform ${
                    selectedTheater === theaterId ? 'rotate-90' : ''
                  }`} />
                </div>

                {selectedTheater === theaterId && (
                  <div className="mt-4">
                    {shows.length === 0 ? (
                      <p className="text-sm text-gray-500">No showtimes available</p>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {shows
                            .sort((a, b) => a.showTime.localeCompare(b.showTime))
                            .map((show) => (
                              <button
                                key={show.showId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowSelect(show);
                                }}
                                className={`px-3 py-3 rounded border text-sm ${
                                  selectedShow?.showId === show.showId
                                    ? "bg-red-500 text-white border-red-500"
                                    : "border-gray-300 hover:border-red-300"
                                }`}
                              >
                                <div className="flex items-center justify-center mb-1">
                                  <Clock size={14} className="mr-1" />
                                  <span className="font-semibold">{show.showTime.slice(0, 5)}</span>
                                </div>
                                {show.language && (
                                  <div className="text-xs opacity-75">
                                    {show.language}
                                    {show.format && ` • ${show.format}`}
                                  </div>
                                )}
                                {show.screenNumber && (
                                  <div className="text-xs opacity-75 mt-1">
                                    {show.screenNumber}
                                  </div>
                                )}
                                {show.availableSeats !== undefined && (
                                  <div className="text-xs mt-1 flex items-center justify-center">
                                    <Ticket size={12} className="mr-1" />
                                    {show.availableSeats} seats
                                  </div>
                                )}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Continue */}
      <div className="flex justify-center my-8">
        <button
          disabled={!selectedShow}
          onClick={handleContinue}
          className={`px-8 py-3 rounded text-white font-semibold flex items-center ${
            selectedShow
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
