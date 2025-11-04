import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};


export const getMyEvents = () => api.get('/events');
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEventStatus = (id, status) => api.put(`/events/${id}`, { status });

// Swap API functions
export const getSwappableSlots = () => api.get('/swap/swappable-slots');
export const getMySwappableEvents = () => api.get('/events/swappable');
export const createSwapRequest = (mySlotId, theirSlotId) => 
  api.post('/swap/swap-request', { mySlotId, theirSlotId });

export const getMySwapRequests = () => api.get('/swap/requests');
export const respondToSwapRequest = (requestId, accept) =>
  api.post(`/swap/swap-response/${requestId}`, { accept });