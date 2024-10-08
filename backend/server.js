const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const listsRoutes = require('./routes/listsRoutes');
const imageRoutes = require('./routes/imageRoutes');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configuring CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://httppaw.onrender.com',
  'https://http-paw.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

const dbPassword = process.env.MONGO_URL;

mongoose.connect(dbPassword, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/images', imageRoutes);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles
    },
  },
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
