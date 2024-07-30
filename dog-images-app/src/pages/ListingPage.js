import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ListingPage.css';  
const ListingPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/lists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched lists:', data);
        setLists(data);
      } catch (error) {
        console.error('Error fetching lists:', error);
        setError('Failed to fetch lists.');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleView = (id) => {
    navigate(`/lists/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(lists.filter(list => list._id !== id));
    } catch (error) {
      console.error('Error deleting list:', error);
      setError('Failed to delete list.');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="listing-page">
      <h1>Lists</h1>
      <ul className="list-container">
        {lists.length > 0 ? (
          lists.map(list => (
            <li key={list._id} className="list-item">
              <span>{list.name}</span>
              <div>
                <button className="view-button" onClick={() => handleView(list._id)}>View</button>
                <button className="delete-button" onClick={() => handleDelete(list._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No lists found.</p>
        )}
      </ul>
    </div>
  );
};

export default ListingPage;
