const express = require('express');
const List = require('../models/List'); // Assuming the List model is in models/List.js
const { protect } = require('../middleware/authMiddleware'); // Assuming the middleware is in middleware/authMiddleware.js

const router = express.Router();

// Save a list
router.post('/', protect, async (req, res) => {
  const { name, creationDate, responseCodes, images } = req.body;

  try {
    const newList = new List({
      name,
      creationDate,
      responseCodes,
      images,
      user: req.user._id, // Associate the list with the logged-in user\
    
      
    });
    await newList.save();
    res.status(201).json({ message: 'List saved successfully' });
  } catch (error) {
    console.error('Error saving list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all lists for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user._id });
    res.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific list by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, user: req.user._id });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a specific list
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(updatedList);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific list
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedList = await List.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedList) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json({ message: 'List deleted' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an image from a specific list
router.delete('/:listId/images/:imageId', protect, async (req, res) => {
  const { listId, imageId } = req.params;

  try {
    const list = await List.findOne({ _id: listId, user: req.user._id });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    list.images = list.images.filter(image => image._id.toString() !== imageId);
    await list.save();

    res.json(list);
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
