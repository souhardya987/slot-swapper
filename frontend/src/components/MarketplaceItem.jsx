const MarketplaceItem = ({ slot, onRequestSwap }) => {
  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm flex justify-between items-center">
      <div>
        <h3 className="font-bold">{slot.title}</h3>
        <p className="text-sm text-gray-600">
          {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
        </p>
        <p className="text-sm text-gray-500">
          Owner: {slot.owner.name} ({slot.owner.email})
        </p>
      </div>
      <div>
        <button
          onClick={() => onRequestSwap(slot)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
        >
          Request Swap
        </button>
      </div>
    </div>
  );
};

export default MarketplaceItem;