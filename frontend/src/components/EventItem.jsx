const EventItem = ({ event, onStatusUpdate }) => {
  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'BUSY':
        return 'bg-gray-200 text-gray-800';
      case 'SWAPPABLE':
        return 'bg-green-200 text-green-800';
      case 'SWAP_PENDING':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm flex justify-between items-center">
      <div>
        <h3 className="font-bold">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
        </p>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${getStatusClass(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </div>
      <div>
        {event.status === 'BUSY' && (
          <button
            onClick={() => onStatusUpdate(event._id, 'SWAPPABLE')}
            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
          >
            Make Swappable
          </button>
        )}
        {event.status === 'SWAPPABLE' && (
          <button
            onClick={() => onStatusUpdate(event._id, 'BUSY')}
            className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
          >
            Make Busy
          </button>
        )}
      </div>
    </div>
  );
};

export default EventItem;