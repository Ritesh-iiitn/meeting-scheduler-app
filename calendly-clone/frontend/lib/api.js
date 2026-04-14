import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Event Types
export const getEventTypes = () => api.get('/event-types');
export const getEventTypeBySlug = (slug) => api.get(`/event-types/${slug}`);
export const createEventType = (data) => api.post('/event-types', data);
export const updateEventType = (id, data) => api.put(`/event-types/${id}`, data);
export const deleteEventType = (id) => api.delete(`/event-types/${id}`);

// Availability
export const getAvailability = () => api.get('/availability');
export const updateAvailability = (availability) => api.put('/availability', { availability });

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const getUpcomingBookings = () => api.get('/bookings/upcoming');
export const getPastBookings = () => api.get('/bookings/past');
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
export const getAvailableSlots = (eventSlug, date) => api.get(`/slots/${eventSlug}/${date}`);

export default api;
