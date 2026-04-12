import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FilterBox = ({ title, options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-full shadow-sm p-3 bg-white rounded-md border border-gray-100">
      {/* Filter Title + Toggle Arrow */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Clear Button */}
      <button
        onClick={() => setSelectedOption("All")}
        className="text-xs text-gray-500 hover:text-red-600 mt-2"
      >
        Clear
      </button>

      {/* Show Options when isOpen = true */}
      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option, index) => (
            <button
              type="button"
              onClick={() => setSelectedOption(option)}
              key={index}
              className={`border flex justify-center items-center text-xs min-w-16 px-2 h-8 rounded-md ${selectedOption === option ? 'bg-red-500 text-white' : 'bg-gray-100 text-red-600'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBox;
