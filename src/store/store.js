import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import searchReducer from './slices/searchSlice'
import cityReducer from './slices/citySlice'

const store=configureStore({
    reducer:{
        auth:authReducer,
        search:searchReducer,
        city:cityReducer
    }
})

export default store;