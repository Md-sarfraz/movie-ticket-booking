import React, { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchInput } from "@/store/slices/searchSlice";

const MobileHeader = ({ onOpenDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useSelector((state) => state.search.searchInput) || "";
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    navigate("/movies");
  };

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-[999] bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="px-3 py-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="w-10 h-10 rounded-xl border border-gray-200 text-gray-700 bg-white flex items-center justify-center shrink-0"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div
          className={`flex items-center flex-1 rounded-xl border bg-white px-3 transition-all ${
            focused ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
          }`}
        >
          <Search size={16} className="text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => dispatch(setSearchInput(e.target.value))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search movies"
            className="w-full bg-transparent px-2.5 py-2.5 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
