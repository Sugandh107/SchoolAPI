const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const schoolRoutes = require('./routes/schools');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', schoolRoutes);
app.get('/', (req, res) => {
  res.send('Hello from Sugandh');
});
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
