import { myAxios } from "./helper";

export const getAllEvents = async () => {
  const response = await myAxios.get("/events/findAll");
  return response.data.data || [];
};

export const getEventById = async (id) => {
  const response = await myAxios.get(`/events/get/${id}`);
  return response.data.data;
};

export const createEvent = async (eventData, imageFile, backgroundImageFile) => {
  const formData = new FormData();
  formData.append("event", JSON.stringify(eventData));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (backgroundImageFile) {
    formData.append("backgroundImage", backgroundImageFile);
  }

  const response = await myAxios.post("/events/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEvent = async (id, eventData, imageFile, backgroundImageFile) => {
  const formData = new FormData();
  formData.append("event", JSON.stringify(eventData));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (backgroundImageFile) {
    formData.append("backgroundImage", backgroundImageFile);
  }

  const response = await myAxios.put(`/events/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await myAxios.delete(`/events/delete/${id}`);
  return response.data;
};
