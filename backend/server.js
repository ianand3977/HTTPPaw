const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const listsRoutes = require('./routes/listsRoutes'); // Ensure this path is correct
const imageRoutes = require('./routes/imageRoutes'); // Include imageRoutes
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbPassword = process.env.MONGO_URL;

mongoose.connect(dbPassword, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/lists', listsRoutes); // Ensure this route is correct
app.use('/api/images', imageRoutes); // Add imageRoutes

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
