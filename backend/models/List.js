// backend/models/List.js
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  responseCodes: [String],
  images: [
    {
      status_code: Number,
      title: String,
      image: {
        avif: String,
        jpg: String,
        jxl: String,
        webp: String,
      },
      url: String,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const List = mongoose.model('List', listSchema);
module.exports = List;
