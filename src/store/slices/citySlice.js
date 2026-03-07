import { createSlice } from "@reduxjs/toolkit";

// selectedCity shape: { id: number, name: string } | null
const loadCity = () => {
  try {
    const raw = localStorage.getItem("selectedCity");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Must have numeric id and string name
    if (parsed && typeof parsed.id === "number" && typeof parsed.name === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const citySlice = createSlice({
  name: "city",
  initialState: {
    selectedCity: loadCity(),
  },
  reducers: {
    setSelectedCity: (state, action) => {
      // action.payload must be { id, name } or null
      state.selectedCity = action.payload;
      if (action.payload) {
        localStorage.setItem("selectedCity", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedCity");
      }
    },
    clearSelectedCity: (state) => {
      state.selectedCity = null;
      localStorage.removeItem("selectedCity");
    },
  },
});

export const { setSelectedCity, clearSelectedCity } = citySlice.actions;
export default citySlice.reducer;
