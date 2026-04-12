import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import searchReducer from './slices/searchSlice'
import cityReducer from './slices/citySlice'
import eventBookingReducer from './slices/eventBookingSlice'

const store=configureStore({
    reducer:{
        auth:authReducer,
        search:searchReducer,
        city:cityReducer,
        eventBooking:eventBookingReducer
    }
})

export default store;