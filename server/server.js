const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path'); 
const authRoutes = require('./routes/authRoutes.js');
const workoutRoutes = require('./routes/workoutRoutes.js');
const dateRoutes = require('./routes/dateRoutes.js');
require('dotenv').config();

const app = express();

//Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connect to database
mongoose.connect(process.env.DATABASE_LINK);

//Setup routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/dates', dateRoutes);

//Serve static files from the React app
app.use('/', express.static(path.join(__dirname, '../client/build')));

//Serve all other routes from React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening`);
});