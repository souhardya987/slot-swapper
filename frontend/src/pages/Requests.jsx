import { useState, useEffect } from 'react';
import { getMySwapRequests, respondToSwapRequest } from '../services/api';
import RequestItem from '../components/RequestItem';

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await getMySwapRequests();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accept) => {
    try {
      await respondToSwapRequest(requestId, accept);
      fetchRequests(); // Re-fetch all requests
    } catch (error) {
      console.error('Failed to respond to request', error);
      alert(error.response?.data?.message || 'Failed to respond');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Incoming Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Incoming Requests</h2>
        <div className="space-y-4">
          {incoming.length > 0 ? (
            incoming.map((req) => (
              <RequestItem
                key={req._id}
                request={req}
                type="incoming"
                onRespond={handleResponse}
              />
            ))
          ) : (
            <p>No incoming swap requests.</p>
          )}
        </div>
      </div>

      {/* Outgoing Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Outgoing Requests</h2>
        <div className="space-y-4">
          {outgoing.length > 0 ? (
            outgoing.map((req) => (
              <RequestItem
                key={req._id}
                request={req}
                type="outgoing"
              />
            ))
          ) : (
            <p>You have no outgoing swap requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;