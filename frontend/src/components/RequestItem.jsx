const RequestItem = ({ request, type, onRespond }) => {
  const {
    _id,
    requester,
    responder,
    offeredSlot,
    requestedSlot,
    status,
  } = request;

  const formatSlot = (slot) => {
    if (!slot) return 'Slot deleted';
    return `${slot.title} (${new Date(slot.startTime).toLocaleDateString()})`;
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-200 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-200 text-green-800';
      case 'REJECTED':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">
          {type === 'incoming'
            ? `From: ${requester.name}`
            : `To: ${responder.name}`}
        </h3>
         <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      <div className="text-sm">
        <p>
          <span className="font-semibold">Offering:</span> {formatSlot(offeredSlot)}
        </p>
        <p>
          <span className="font-semibold">Requesting:</span> {formatSlot(requestedSlot)}
        </p>
      </div>

      {type === 'incoming' && status === 'PENDING' && (
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={() => onRespond(_id, false)}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
          >
            Reject
          </button>
          <button 
            onClick={() => onRespond(_id, true)}
            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestItem;