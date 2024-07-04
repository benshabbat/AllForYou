// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const recipesRouter = require('./routes/recipes');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// app.use('/api/recipes', recipesRouter);

// // חיבור למסד הנתונים (תצטרך להגדיר את ה-URI בקובץ .env)
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });