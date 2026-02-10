//

import { useEffect, useState } from "react";
import api from "../services/api";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/requests/pending");
        setRequests(res.data.data);
      } catch (err) {
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (requests.length === 0) return <p>No pending requests</p>;

  return (
    <div>
      {requests.map((r) => (
        <div key={r._id}>
          {r.companyName} - {r.status}
        </div>
      ))}
    </div>
  );
};

export default Requests;
