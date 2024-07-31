import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './SearchPage.css';  // Import the CSS file for styling
import { baseUrl } from '../urls'; // Import baseUrl

const SearchPage = () => {
  const [responseCode, setResponseCode] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (responseCode) {
      fetchImages(responseCode);
    }
  }, [responseCode]);

  const fetchImages = async (pattern) => {
    setLoading(true);
    setError('');
    setImages([]);
    console.log('Fetching images for pattern:', pattern);
    const patternRegex = new RegExp(`^${pattern.replace(/x/g, '\\d')}`);
    const allCodes = [100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];

    const matchingCodes = allCodes.filter(code => patternRegex.test(code.toString()));
    console.log('Matching codes:', matchingCodes);

    try {
      if (matchingCodes.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      const requests = matchingCodes.map(code => axios.get(`/api/${code}.json`));
      const responses = await Promise.all(requests);
      const fetchedImages = responses.map(response => response.data);
      console.log('Fetched images:', fetchedImages);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchImages = debounce((value) => {
    setResponseCode(value);
  }, 300);

  const handleInputChange = (e) => {
    const { value } = e.target;
    console.log('Input changed:', value);
    debouncedFetchImages(value);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Saving list with response codes:', responseCode, 'and images:', images);
      await axios.post(
        `${baseUrl}/api/lists`,
        { name: 'My List', creationDate: new Date(), responseCodes: [responseCode], images: images },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('List saved successfully');
    } catch (error) {
      console.error('Error saving list:', error);
      setError('Failed to save list.');
    }
  };

  return (
    <div className="search-page">
      <h1 className="title">Search for Dog Images</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter response code or pattern"
          onChange={handleInputChange}
          className="search-input"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <div className="loading">Loading...</div>}
      {!loading && images.length === 0 && responseCode && <div className="no-results">No status codes found for the input pattern.</div>}
      <div className="images-container">
        {images.map((image, index) => (
          <div key={index} className="image-card">
            <h3>Status Code: {image.status_code}</h3>
            <p>Title: {image.title}</p>
            <img src={image.image.jpg} alt="Dog" className="image" />
            <p><a href={image.url} target="_blank" rel="noopener noreferrer" className="view-link">View Details</a></p>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="save-button">Save List</button>
    </div>
  );
};

export default SearchPage;
