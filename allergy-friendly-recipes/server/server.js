const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Allergy-Friendly Recipes API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});