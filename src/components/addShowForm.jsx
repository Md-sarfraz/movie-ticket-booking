import React, { useState, useEffect } from "react";
import { Calendar, Clock, Film, Building2, DollarSign, Users, Languages, Monitor } from "lucide-react";
import { myAxios } from "../services/helper";
import { toast } from "react-toastify";

const AddShowForm = () => {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    screenNumber: "",
    showDate: "",
    showTime: "",
    price: "",
    totalSeats: "",
    availableSeats: "",
    language: "",
    format: "2D",
  });

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await myAxios.get("/movie/findAllMovie");
      setMovies(response.data.data); // Extract movies from ApiResponse wrapper
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await myAxios.get("/theater/all");
      setTheaters(response.data.data); // Extract theaters from ApiResponse wrapper
    } catch (error) {
      console.error("Error fetching theaters:", error);
      toast.error("Failed to load theaters");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If theater is changed, update selected theater and reset screen
    if (name === "theaterId") {
      const theater = theaters.find(t => t.id === parseInt(value));
      setSelectedTheater(theater);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        screenNumber: "", // Reset screen selection when theater changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Auto-set available seats equal to total seats initially
        ...(name === "totalSeats" && { availableSeats: value }),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.movieId || !formData.theaterId || !formData.screenNumber || !formData.showDate || !formData.showTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Find selected movie and theater
      const selectedMovie = movies.find(m => m.movieId === parseInt(formData.movieId));
      const selectedTheater = theaters.find(t => t.id === parseInt(formData.theaterId));

      const showData = {
        movie: selectedMovie,
        theater: selectedTheater,
        screenNumber: formData.screenNumber || null,
        showDate: formData.showDate,
        showTime: formData.showTime,
        price: parseFloat(formData.price) || 0,
        totalSeats: parseInt(formData.totalSeats) || 100,
        availableSeats: parseInt(formData.availableSeats) || parseInt(formData.totalSeats) || 100,
        language: formData.language || selectedMovie?.language,
        format: formData.format || "2D",
      };

      const response = await myAxios.post("/shows/create", showData);
      console.log("Show created:", response.data);
      
      toast.success("Show created successfully!");
      
      // Reset form
      setFormData({
        movieId: "",
        theaterId: "",
        screenNumber: "",
        showDate: "",
        showTime: "",
        price: "",
        totalSeats: "",
        availableSeats: "",
        language: "",
        format: "2D",
      });
      setSelectedTheater(null);
    } catch (error) {
      console.error("Error creating show:", error);
      toast.error(error.response?.data || "Failed to create show");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Calendar className="mr-2 text-red-500" />
        Add New Show
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Movie Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Film className="mr-2 text-red-500" size={18} />
            Movie *
          </label>
          <select
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie.movieId} value={movie.movieId}>
                {movie.title} ({movie.language})
              </option>
            ))}
          </select>
        </div>

        {/* Theater Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Building2 className="mr-2 text-red-500" size={18} />
            Theater *
          </label>
          <select
            name="theaterId"
            value={formData.theaterId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select a theater</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name} - {theater.city?.name || theater.city}
              </option>
            ))}
          </select>
        </div>

        {/* Screen Number */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Monitor className="mr-2 text-red-500" size={18} />
            Screen Number *
          </label>
          <select
            name="screenNumber"
            value={formData.screenNumber}
            onChange={handleChange}
            required
            disabled={!formData.theaterId}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {formData.theaterId ? "Select a screen" : "Select theater first"}
            </option>
            {selectedTheater && selectedTheater.screens && 
              Array.from({ length: selectedTheater.screens }, (_, i) => i + 1).map((screenNum) => (
                <option key={screenNum} value={`Screen ${screenNum}`}>
                  Screen {screenNum}
                </option>
              ))
            }
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {selectedTheater ? 
              `This theater has ${selectedTheater.screens} screen${selectedTheater.screens > 1 ? 's' : ''}` : 
              'Select a theater to see available screens'
            }
          </p>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Calendar className="mr-2 text-red-500" size={18} />
              Show Date *
            </label>
            <input
              type="date"
              name="showDate"
              value={formData.showDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Clock className="mr-2 text-red-500" size={18} />
              Show Time *
            </label>
            <input
              type="time"
              name="showTime"
              value={formData.showTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Price and Seats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <DollarSign className="mr-2 text-red-500" size={18} />
              Price per Seat
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              placeholder="250.00"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Users className="mr-2 text-red-500" size={18} />
              Total Seats
            </label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Users className="mr-2 text-green-500" size={18} />
              Available Seats
            </label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Language and Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Languages className="mr-2 text-red-500" size={18} />
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g., English, Hindi, Tamil"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Monitor className="mr-2 text-red-500" size={18} />
              Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
              <option value="4DX">4DX</option>
              <option value="Dolby Atmos">Dolby Atmos</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                movieId: "",
                theaterId: "",
                screenNumber: "",
                showDate: "",
                showTime: "",
                price: "",
                totalSeats: "",
                availableSeats: "",
                language: "",
                format: "2D",
              });
              setSelectedTheater(null);
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Create Show
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShowForm;
