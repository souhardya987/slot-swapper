import { useState, useEffect } from 'react';
import { getMyEvents, createEvent, updateEventStatus } from '../services/api';
import EventItem from '../components/EventItem';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  
  // Updated state for date and time
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [startTime, setStartTime] = useState(''); // HH:MM
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchEvents = async () => {
    try {
      const { data } = await getMyEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Helper function to combine date and time into an ISO 8601 string
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    // Creates a valid timestamp string like "2025-11-05T10:30:00"
    const isoString = `${date}T${time}:00`;
    return new Date(isoString).toISOString();
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const combinedStartTime = combineDateTime(startDate, startTime);
    const combinedEndTime = combineDateTime(endDate, endTime);

    if (!combinedStartTime || !combinedEndTime) {
      alert("Invalid date or time");
      return;
    }

    try {
      await createEvent({
        title,
        startTime: combinedStartTime,
        endTime: combinedEndTime,
      });
      // Reset all form fields
      setTitle('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      fetchEvents(); // Re-fetch events
    } catch (error) {
      console.error('Failed to create event', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateEventStatus(id, newStatus);
      fetchEvents(); // Re-fetch events to show update
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create Event Form */}
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Event
          </button>
        </form>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">My Events</h2>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <EventItem
                key={event._id}
                event={event}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          ) : (
            <p>You have no events.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;