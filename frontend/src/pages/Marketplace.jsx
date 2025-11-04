import { useState, useEffect } from 'react';
import {
  getSwappableSlots,
  getMySwappableEvents,
  createSwapRequest,
} from '../services/api';
import MarketplaceItem from '../components/MarketplaceItem';

const Marketplace = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null); // The slot I want
  const [selectedMySlot, setSelectedMySlot] = useState(''); // The slot I'm offering
  const [showModal, setShowModal] = useState(false);

  const fetchSlots = async () => {
    try {
      const { data } = await getSwappableSlots();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Failed to fetch swappable slots', error);
    }
  };

  const fetchMySlots = async () => {
    try {
      const { data } = await getMySwappableEvents();
      setMySwappableSlots(data);
    } catch (error) {
      console.error('Failed to fetch my swappable slots', error);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchMySlots(); // Fetch user's own swappable slots for the modal
  }, []);

  const handleRequestSwapClick = (slot) => {
    setSelectedTheirSlot(slot);
    setSelectedMySlot('');
    setShowModal(true);
  };

  const handleConfirmSwap = async (e) => {
    e.preventDefault();
    if (!selectedMySlot) {
      alert('Please select one of your slots to offer.');
      return;
    }
    try {
      await createSwapRequest(selectedMySlot, selectedTheirSlot._id);
      setShowModal(false);
      fetchSlots(); // Re-fetch to remove the slot (now SWAP_PENDING)
      fetchMySlots(); // Re-fetch my slots
    } catch (error) {
      console.error('Failed to create swap request', error);
      alert(error.response?.data?.message || 'Failed to create swap');
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Marketplace</h2>
        <div className="space-y-4">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <MarketplaceItem
                key={slot._id}
                slot={slot}
                onRequestSwap={handleRequestSwapClick}
              />
            ))
          ) : (
            <p>No swappable slots available right now.</p>
          )}
        </div>
      </div>

      {/* Swap Request Modal */}
      {showModal && selectedTheirSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Request Swap
            </h3>
            <p className="mb-2">
              You are requesting: <strong>{selectedTheirSlot.title}</strong>
            </p>
            <form onSubmit={handleConfirmSwap}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer one of your swappable slots:
              </label>
              <select
                value={selectedMySlot}
                onChange={(e) => setSelectedMySlot(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="" disabled>Select your slot...</option>
                {mySwappableSlots.length > 0 ? (
                  mySwappableSlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.title} ({new Date(slot.startTime).toLocaleString()})
                    </option>
                  ))
                ) : (
                  <option disabled>You have no swappable slots</option>
                )}
              </select>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mySwappableSlots.length === 0}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Marketplace;