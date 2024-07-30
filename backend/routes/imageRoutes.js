const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseURL = 'https://http.dog';

router.get('/', async (req, res) => {
  const { filter } = req.query;
  try {
    // Construct the URL to fetch images
    const imageUrls = [];

    // Check if the filter is a regex pattern or a specific code
    const regexPattern = new RegExp(filter.replace(/x/g, '\\d'), 'i');

    // Fetch images for all status codes from 100 to 599
    for (let i = 100; i <= 599; i++) {
      const statusCode = i.toString();
      if (regexPattern.test(statusCode)) {
        // Fetch .jpg image and other formats
        imageUrls.push(
          `${baseURL}/${statusCode}.jpg`,
          `${baseURL}/${statusCode}.webp`,
          `${baseURL}/${statusCode}.jxl`,
          `${baseURL}/${statusCode}.avif`
        );
      }
    }

    // Remove duplicate URLs
    const uniqueUrls = [...new Set(imageUrls)];

    res.json(uniqueUrls);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching images' });
  }
});

module.exports = router;
