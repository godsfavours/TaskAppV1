const express = require('express');
const app = express();
const path = require('path');

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tasksDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Error connecting to Database.");
  })
  .catch(err => {
    console.log("An error occured while attempting to connect to DB");
    console.log(err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.listen(8080, () => {
  console.log("Listening on port 8080 (localhost:8080)");
})

app.get('/', (req, res) => {
  res.redirect('/tasks');
})

app.get('/tasks', (req, res) => {
  res.render('index');
});

