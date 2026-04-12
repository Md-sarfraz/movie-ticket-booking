import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Tag } from 'lucide-react';

const EventSlider = ({ items = [] }) => {
  const safeItems = items || [];
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (safeItems.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
        No events to display
      </div>
    );
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 3 >= safeItems.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? Math.max(0, safeItems.length - 3) : prev - 1));
  };

  // Display 3 cards at a time
  const visibleItems = safeItems.slice(activeIndex, activeIndex + 4);
  // If we don't have enough items to show, wrap around
  if (visibleItems.length < 3) {
    visibleItems.push(...safeItems.slice(0, 4 - visibleItems.length));
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Cards Container */}
      <div className="flex sm:justify-center gap-3 sm:gap-4 py-2 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory">
        {visibleItems.map((item, index) => (
          <div 
            key={item.id || `${activeIndex}-${index}`} 
            className="min-w-[82%] sm:min-w-0 sm:w-64 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg sm:hover:-translate-y-1 snap-start"
          >
            {/* Card Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={item.imageUrl || "/api/placeholder/256/128"}
                alt={item.title || "Event"}
                className="w-full h-full object-cover"
              />
              {item.category && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium text-blue-700 w-fit">
                    <Tag size={10} className="text-blue-700" />
                    {item.category}
                  </span>
                </div>
              )}
            </div>
            
            {/* Card Content */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {item.title || "Event Title"}
              </h3>
              
              <div className="space-y-1 mb-3">
                {item.date && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={12} className="mr-1 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{item.date}</span>
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin size={12} className="mr-1 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                {item.price ? (
                  <span className="font-bold text-sm text-gray-900">
                    {item.price}
                  </span>
                ) : (
                  <span className="font-bold text-sm text-green-600">
                    Free
                  </span>
                )}
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2 py-1 rounded transition-colors">
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="hidden sm:flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-0">
        <button 
          onClick={prevSlide}
          className="bg-white/90 shadow-md rounded-full p-1.5 hover:bg-white transition-colors -ml-3"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} className="text-gray-700" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="bg-white/90 shadow-md rounded-full p-1.5 hover:bg-white transition-colors -mr-3"
          aria-label="Next slide"
        >
          <ChevronRight size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="hidden sm:flex justify-center mt-4 gap-1">
        {[...Array(Math.min(5, safeItems.length))].map((_, index) => {
          const isActive = index === activeIndex % Math.min(5, safeItems.length);
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all ${
                isActive 
                  ? "bg-blue-600 w-4 h-1.5" 
                  : "bg-gray-300 w-1.5 h-1.5"
              }`}
              aria-label={`Go to slide group ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EventSlider;