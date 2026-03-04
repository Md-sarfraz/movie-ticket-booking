import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
  name: "city",
  initialState: {
    selectedCity: localStorage.getItem("selectedCity") || null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      localStorage.setItem("selectedCity", action.payload);
    },
    clearSelectedCity: (state) => {
      state.selectedCity = null;
      localStorage.removeItem("selectedCity");
    },
  },
});

export const { setSelectedCity, clearSelectedCity } = citySlice.actions;
export default citySlice.reducer;
