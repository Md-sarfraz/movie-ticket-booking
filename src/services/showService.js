import { myAxios } from "./helper";

// Get shows by movie with optional filters
export const getShowsByMovie = async (movieId, cityId = null, date = null) => {
  try {
    console.log("========================================");
    console.log("🌐 showService.getShowsByMovie");
    console.log("   movieId:", movieId);
    console.log("   cityId:", cityId);
    console.log("   date:", date);
    
    let url = `/shows/by-movie/${movieId}`;
    const params = new URLSearchParams();
    
    if (cityId) {
      params.append('cityId', cityId);
      console.log("   ✅ Adding cityId to query:", cityId);
    }
    if (date) {
      // Format date as YYYY-MM-DD using local timezone
      let formattedDate;
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else {
        formattedDate = date;
      }
      params.append('date', formattedDate);
      console.log("   ✅ Adding date to query:", formattedDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log("   🔗 Final URL:", url);
    console.log("========================================");
    
    const response = await myAxios.get(url);
    
    console.log("========================================");
    console.log("📥 Response received:");
    console.log("   Status:", response.status);
    console.log("   Shows count:", response.data?.data?.length || 0);
    if (response.data?.data?.length > 0) {
      response.data.data.forEach((show, i) => {
        console.log(`   Show ${i+1}:`, {
          id: show.showId,
          theater: show.theater?.name,
          city: show.theater?.city?.name,
          time: show.showTime,
          date: show.showDate
        });
      });
    } else {
      console.log("   ⚠️ No shows returned from backend!");
    }
    console.log("========================================");
    
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching shows:", error);
    console.error("   Error details:", error.response?.data);
    throw error;
  }
};

// Get upcoming shows for a movie
export const getUpcomingShows = async (movieId) => {
  try {
    const response = await myAxios.get(`/shows/upcoming/${movieId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching upcoming shows:", error);
    throw error;
  }
};

// Get available dates for a movie
export const getAvailableDates = async (movieId, cityId = null) => {
  try {
    let url = `/shows/dates/${movieId}`;
    if (cityId) {
      url += `?cityId=${cityId}`;
    }
    const response = await myAxios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching available dates:", error);
    throw error;
  }
};

// Get available shows (with seats)
export const getAvailableShows = async (movieId) => {
  try {
    const response = await myAxios.get(`/shows/available/${movieId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching available shows:", error);
    throw error;
  }
};

// Book seats for a show
export const bookSeats = async (showId, numberOfSeats) => {
  try {
    const response = await myAxios.post(`/shows/book/${showId}/${numberOfSeats}`);
    return response.data.data;
  } catch (error) {
    console.error("Error booking seats:", error);
    throw error;
  }
};

// Get show by ID
export const getShowById = async (showId) => {
  try {
    const response = await myAxios.get(`/shows/${showId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching show:", error);
    throw error;
  }
};
