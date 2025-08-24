import React, { useEffect, useState } from "react";
import api from "../api"; // Your axios/fetch instance
import { FaStar } from "react-icons/fa";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [userRatings, setUserRatings] = useState({}); // track user ratings locally for selects

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.get("/stores", {
          params: {
            name: filterName || "",
            address: filterAddress || ""
          }
        });
        setStores(res.data);
        // Initialize userRatings from API response
        const initialRatings = {};
        res.data.forEach(store => {
          initialRatings[store.id] = store.my_rating || 0;
        });
        setUserRatings(initialRatings);

      } catch (err) {
        setStores([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [filterName, filterAddress]);

  const handleRate = async (storeId, ratingValue) => {
    setRatingSubmitting(true);
    try {
      await api.post(`/stores/${storeId}/rate`, { rating: ratingValue });
      setMessage("Rating saved!");
      setUserRatings(prev => ({ ...prev, [storeId]: ratingValue }));

      // Optional: refresh stores list for updated overall averages
      // const res = await api.get("/stores");
      // setStores(res.data);

    } catch (err) {
      setMessage("Error saving rating!");
    }
    setRatingSubmitting(false);
    setTimeout(() => setMessage(""), 1500);
  };

  const starColors = {
    filled: "#ffc107",
    empty: "#e4e5e9"
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Stores</h2>
      <div className="mb-3 row align-items-center">
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by store name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by address"
            value={filterAddress}
            onChange={(e) => setFilterAddress(e.target.value)}
          />
        </div>
      </div>
      {message && <div className="alert alert-info">{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : stores.length === 0 ? (
        <div>No stores found.</div>
      ) : (
        <div className="list-group">
          {stores.map(store => {
            const ratingVal = userRatings[store.id] || 0;
            return (
              <div
                className="list-group-item mb-3 shadow-sm"
                key={store.id}
                style={{ borderRadius: "12px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong style={{ fontSize: "1.1rem" }}>{store.name}</strong>
                    <div className="text-muted">{store.address}</div>
                  </div>
                  <div>
                    <span className="badge bg-primary me-2">
                      &#11088; {Number(store.avg_rating) && !isNaN(Number(store.avg_rating))
                        ? Number(store.avg_rating).toFixed(2)
                        : "0.00"} Overall
                    </span>

                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      size={20}
                      style={{ cursor: "pointer", marginRight: 5 }}
                      color={star <= ratingVal ? starColors.filled : starColors.empty}
                      onClick={() => !ratingSubmitting && handleRate(store.id, star)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
