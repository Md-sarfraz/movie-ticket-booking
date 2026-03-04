import React from 'react';
import { Film, Ticket } from 'lucide-react';

export default function BookTheShowLogo() {
  return (
    <div className="flex items-center space-x-1.5 group cursor-pointer">
      {/* Icon Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-red-500 to-pink-600 p-1.5 rounded-md shadow-md transform group-hover:scale-110 transition-transform duration-300">
          <Film className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Text */}
      <div className="flex items-center space-x-0.5">
        <span className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Ticket
        </span>
        <span className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Flix
        </span>
      </div>
      
      {/* Decorative Ticket Icon */}
      <Ticket className="w-3 h-3 text-red-500 animate-pulse hidden sm:block" />
    </div>
  );
}