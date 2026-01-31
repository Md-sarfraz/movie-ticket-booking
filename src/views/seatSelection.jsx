import React, { useState } from "react";
import { Check, X, Ticket, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const navigate = useNavigate();

  // Get movie data from location state
  const location = useLocation();
  const movie = location.state?.data || { 
    title: "Movie Title", 
    price: 12.99, 
    showtime: "Today, 7:30 PM",
    format: "Standard"
  };
  
  // Use movie price from the passed state, ensure it's a number
  const seatPrice = typeof movie.price === 'number' ? movie.price : parseFloat(movie.price) || 12.99;

  // Creating a theater layout with rows labeled A-L
  const rowLabels = "ABCDEFGHIJKL".split("");
  
  // Seat layout with patterns of taken seats
  const seats = [
    ["available", "available", "available", "taken", "taken", "taken", "aisle", "available", "available", "available", "taken", "available", "available"],
    ["taken", "available", "taken", "taken", "available", "available", "aisle", "available", "taken", "available", "available", "available", "available"],
    ["available", "available", "available", "available", "available", "available", "aisle", "available", "available", "taken", "available", "available", "available"],
    ["taken", "taken", "available", "available", "available", "available", "aisle", "taken", "taken", "taken", "available", "available", "available"],
    ["available", "taken", "available", "available", "taken", "taken", "aisle", "taken", "available", "taken", "taken", "available", "available"],
    ["available", "available", "taken", "taken", "taken", "available", "aisle", "taken", "available", "available", "available", "available", "taken"],
    ["available", "taken", "available", "available", "taken", "taken", "aisle", "available", "available", "taken", "available", "taken", "available"],
    ["available", "available", "available", "taken", "taken", "available", "aisle", "taken", "taken", "available", "available", "available", "available"],
    ["taken", "available", "taken", "available", "taken", "available", "aisle", "available", "available", "taken", "taken", "taken", "taken"],
    ["available", "available", "taken", "taken", "available", "available", "aisle", "available", "available", "available", "available", "available", "available"],
    ["available", "available", "available", "available", "available", "taken", "aisle", "taken", "taken", "available", "available", "taken", "available"],
    ["available", "taken", "available", "taken", "available", "available", "aisle", "available", "taken", "available", "taken", "available", "available"]
  ];

  // Handle seat selection
  const handleSeatClick = (rowIndex, seatIndex) => {
    const isSelected = selectedSeats.some(
      (seat) => seat.row === rowIndex && seat.index === seatIndex
    );

    setSelectedSeats((prevSeats) =>
      isSelected
        ? prevSeats.filter(
            (seat) => seat.row !== rowIndex || seat.index !== seatIndex
          )
        : [...prevSeats, { row: rowIndex, index: seatIndex, price: seatPrice }]
    );
  };

  // Get seat number (combine row letter with seat number)
  const getSeatLabel = (rowIndex, seatIndex) => {
    // adjust seat number for the aisle in column 6
    const realSeatIndex = seatIndex >= 6 ? seatIndex : seatIndex + 1;
    return `${rowLabels[rowIndex]}${realSeatIndex}`;
  };

  // Calculate total price - ensure we're returning a number
  const calculateTotal = () => {
    if (selectedSeats.length === 0) return 0;
    
    const total = selectedSeats.reduce((sum, seat) => {
      const price = typeof seat.price === 'number' ? seat.price : parseFloat(seat.price) || 0;
      return sum + price;
    }, 0);
    
    return total;
  };

  // Format price for display
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-screen md:min-h-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-3 md:p-4 text-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <h1 className="text-lg md:text-2xl font-bold">Select Your Seats</h1>
            <p className="text-blue-100 text-sm md:text-base">{movie.title} - {movie.format || 'Standard'} • {movie.showtime || 'Today, 7:30 PM'}</p>
          </div>
          <div className="bg-blue-800 px-3 md:px-4 py-2 rounded-lg">
            <p className="text-sm md:text-lg font-bold">Price: ${formatPrice(seatPrice)} per seat</p>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6">
        {/* Screen */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 w-full h-6 md:h-8 mb-1 text-center text-white flex items-center justify-center rounded-md shadow-md text-sm md:text-base">
            SCREEN
          </div>
          <div className="h-8 md:h-12 w-full bg-gradient-to-b from-gray-300 opacity-40"></div>
        </div>

        {/* Horizontal Layout - Full Width */}
        <div className="w-full flex justify-center mb-4 md:mb-6">
          <div className="flex overflow-x-auto max-w-full">
            {/* Row labels column */}
            <div className="flex flex-col space-y-1 pr-1 md:pr-2 flex-shrink-0">
              {rowLabels.map((label, index) => (
                <div key={`label-${index}`} className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center font-bold text-gray-600 text-xs md:text-sm">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Seats grid - using full available width */}
            <div className="flex">
              {seats[0].map((_, colIndex) => (
                colIndex === 6 ? (
                  // Aisle column
                  <div key={`aisle-${colIndex}`} className="flex flex-col space-y-1 mx-1 md:mx-2 flex-shrink-0">
                    {seats.map((_, rowIndex) => (
                      <div key={`aisle-${rowIndex}`} className="h-6 md:h-8 flex items-center justify-center text-gray-400">
                        •
                      </div>
                    ))}
                  </div>
                ) : (
                  // Regular seat column
                  <div key={`col-${colIndex}`} className="flex flex-col space-y-1">
                    {seats.map((row, rowIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-md transition duration-200 ${
                          row[colIndex] === "taken"
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Taken seat
                            : selectedSeats.some(
                                (s) => s.row === rowIndex && s.index === colIndex
                              )
                            ? "bg-blue-600 text-white hover:bg-blue-700" // Selected seat
                            : "bg-white border border-gray-300 hover:bg-blue-100 hover:border-blue-300" // Available seat
                        }`}
                        disabled={row[colIndex] === "taken"}
                        onClick={() => handleSeatClick(rowIndex, colIndex)}
                        onMouseEnter={() => setHoveredSeat({ row: rowIndex, index: colIndex })}
                        onMouseLeave={() => setHoveredSeat(null)}
                      >
                        {row[colIndex] === "taken" ? (
                          <X size={10} className="md:hidden" />
                        ) : selectedSeats.some(
                            (s) => s.row === rowIndex && s.index === colIndex
                          ) ? (
                          <Check size={10} className="md:hidden" />
                        ) : (
                          ""
                        )}
                        {row[colIndex] === "taken" ? (
                          <X size={14} className="hidden md:block" />
                        ) : selectedSeats.some(
                            (s) => s.row === rowIndex && s.index === colIndex
                          ) ? (
                          <Check size={14} className="hidden md:block" />
                        ) : (
                          ""
                        )}
                      </button>
                    ))}
                  </div>
                )
              ))}
            </div>
            
            {/* Row labels column (right side) */}
            <div className="flex flex-col space-y-1 pl-1 md:pl-2 flex-shrink-0">
              {rowLabels.map((label, index) => (
                <div key={`right-label-${index}`} className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center font-bold text-gray-600 text-xs md:text-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>mm
        </div>

        {/* Hover info */}
        {hoveredSeat && seats[hoveredSeat.row][hoveredSeat.index] !== "taken" && (
          <div className="text-center mb-4 text-xs md:text-sm px-3 md:px-4 py-2 bg-gray-50 rounded-lg">
            <span className="font-medium">
              Seat {getSeatLabel(hoveredSeat.row, hoveredSeat.index)} - ${formatPrice(seatPrice)}
              {selectedSeats.some(s => s.row === hoveredSeat.row && s.index === hoveredSeat.index) ? " (Selected)" : " (Available)"}
            </span>
          </div>
        )}

        {/* Combined Information Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Legend */}
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-md flex items-center justify-center text-white mr-2">
                <Check size={10} className="md:hidden" />
                <Check size={14} className="hidden md:block" />
              </div>
              <p className="text-xs md:text-sm">Selected</p>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-md border border-gray-300 mr-2"></div>
              <p className="text-xs md:text-sm">Available</p>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mr-2">
                <X size={10} className="md:hidden" />
                <X size={14} className="hidden md:block" />
              </div>
              <p className="text-xs md:text-sm">Taken</p>
            </div>
          </div>

          {/* Selection summary */}
          <div className="lg:col-span-2 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <Ticket size={16} className="md:hidden text-blue-600 mr-2" />
              <Ticket size={18} className="hidden md:block text-blue-600 mr-2" />
              <h3 className="font-bold text-sm md:text-base">Selected Seats</h3>
            </div>
            
            {selectedSeats.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
                  {selectedSeats.map((seat) => (
                    <span key={`selected-${seat.row}-${seat.index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs md:text-sm">
                      {getSeatLabel(seat.row, seat.index)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-blue-200 gap-1">
                  <span className="font-medium text-sm md:text-base">{selectedSeats.length} × ${formatPrice(seatPrice)}</span>
                  <span className="font-bold text-sm md:text-base">Total: ${formatPrice(calculateTotal())}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-xs md:text-sm">No seats selected yet</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
          <button 
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-sm md:text-base"
            onClick={() => setSelectedSeats([])}
          >
            Clear Selection
          </button>
          
          <button 
            className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded shadow text-white transition-colors text-sm md:text-base ${
              selectedSeats.length > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={selectedSeats.length === 0}
            onClick={() => {
              // Pass selected seats and movie data to the payment page
              navigate('/paymentPage', { 
                state: { 
                  seats: selectedSeats,
                  movie: movie,
                  totalPrice: calculateTotal(),
                  seatLabels: selectedSeats.map(seat => getSeatLabel(seat.row, seat.index))
                } 
              });
            }}
            
          >
            Checkout <CreditCard size={14} className="md:hidden" />
            <CreditCard size={16} className="hidden md:block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;