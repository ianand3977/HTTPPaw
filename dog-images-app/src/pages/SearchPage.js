import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './SearchPage.css';  // Import the CSS file for styling
import { baseUrl } from '../urls'; // Import baseUrl

const SearchPage = () => {
  const [responseCode, setResponseCode] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Wrap fetchImages in useCallback to ensure it's stable
  const fetchImages = useCallback(async (pattern) => {
    setLoading(true);
    setError('');
    setImages([]);
    const patternRegex = new RegExp(`^${pattern.replace(/x/g, '\\d')}`);
    const allCodes = [100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];

    const matchingCodes = allCodes.filter(code => patternRegex.test(code.toString()));

    try {
      if (matchingCodes.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      const requests = matchingCodes.map(code => {
        const url = `${baseUrl}/api/images?filter=${code}`;
        console.log(`Requesting URL: ${url}`);
        return axios.get(url);
      });

      const responses = await Promise.all(requests);

      // Handle the responses to extract .jpg images and relevant details
      const fetchedImages = responses.flatMap(response => {
        if (Array.isArray(response.data)) {
          // Only keep .jpg images and construct image objects with status_code and title
          return response.data
            .filter(url => url.endsWith('.jpg')) // Keep only .jpg images
            .map(url => {
              const status_code = url.split('/').pop().split('.')[0]; // Extract status code from URL
              const title = getTitleForStatusCode(status_code); // Helper function to get title
              return { status_code, title, image: { jpg: url } };
            });
        } else {
          throw new Error('Response is not JSON');
        }
      });

      console.log('Fetched images:', fetchedImages);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to get the title for a status code
  const getTitleForStatusCode = (code) => {
    const statusTitles = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      200: "OK",
      201: "Created",
      202: "Accepted",
      204: "No Content",
      400: "Bad Request",
      401: "Unauthorized",
      404: "Not Found",
      500: "Internal Server Error",
      // Add other status codes and titles as needed
    };
    return statusTitles[code] || "Unknown Status";
  };

  const debouncedFetchImages = useCallback(debounce((value) => {
    setResponseCode(value);
  }, 300), []);

  useEffect(() => {
    if (responseCode) {
      fetchImages(responseCode);
    }
  }, [responseCode, fetchImages]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    console.log('Input changed:', value);
    debouncedFetchImages(value);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
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
            {image.image && image.image.jpg ? (
              <img src={image.image.jpg} alt="Dog" className="image" />
            ) : (
              <p>No image available</p>
            )}
            <p><a href={image.image.jpg} target="_blank" rel="noopener noreferrer" className="view-link">View Details</a></p>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="save-button">Save List</button>
    </div>
  );
};

export default SearchPage;
