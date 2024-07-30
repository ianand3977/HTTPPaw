import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ListDetailPage.css';  // Import the CSS file for styling
import { baseUrl } from '../urls'; // Import baseUrl

const ListDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
              
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${baseUrl}/api/lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setList(data);
        setName(data.name);
      } catch (error) {
        console.error('Error fetching list:', error);
        setError('Failed to fetch list details.');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  const handleSave = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${baseUrl}/api/lists/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setList(prevList => ({ ...prevList, name }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating list:', error);
      setError('Failed to update list.');
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/lists');
    } catch (error) {
      console.error('Error deleting list:', error);
      setError('Failed to delete list.');
    }
  };

  const handleImageDelete = async (imageId) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${baseUrl}/api/lists/${id}/images/${imageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setList(response.data); 
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image.');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="list-detail-page">
      {list ? (
        <div className="list-details-container">
          <h1>{editing ? 'Edit List' : 'List Details'}</h1>
          {editing ? (
            <div className="edit-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="edit-input"
              />
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={() => setEditing(false)} className="cancel-button">Cancel</button>
            </div>
          ) : (
            <div className="view-container">
              <h2>{list.name}</h2>
              <div className="image-gallery">
                {list.images.length > 0 ? (
                  list.images.map((img) => (
                    <div key={img._id} className="image-container">
                      <img
                        src={img.image.jpg}
                        alt={img.title}
                        className="image-item"
                        onClick={() => window.open(img.url, '_blank')}
                      />
                      <p className="image-title">{img.title}</p>
                      <button onClick={() => handleImageDelete(img._id)} className="delete-button">Drop Item</button>
                    </div>
                  ))
                ) : (
                  <p>No images available.</p>
                )}
              </div>
              <button onClick={() => setEditing(true)} className="edit-button">Edit</button>
              <button onClick={handleDelete} className="delete-list-button">Delete List</button>
            </div>
          )}
        </div>
      ) : (
        <p>No list found.</p>
      )}
    </div>
  );
};

export default ListDetailPage;
