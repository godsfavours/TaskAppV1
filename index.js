const express = require('express');
const app = express();
const path = require('path');

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tasksDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to Database.");
}).catch(err => {
  console.log("An error occured while attempting to connect to DB");
  console.log(err);
});

// DB Schemas & Models
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  lastUpdated: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High']
  }
})

const Task = mongoose.model('Task', taskSchema);

// Application routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.listen(8080, () => {
  console.log("Listening on port 8080 (localhost:8080)");
})

app.get('/', (req, res) => {
  res.redirect('/tasks');
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('index', { tasks });
  } catch (err) {
    console.log('Unable to retrieve tasks');
    console.log(error);
    res.render('error', { errorMsg: error });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('show', { task });
  } catch (err) {
    console.log('Cannot find task.');
    console.log(err);
    res.render('error', { errorMsg: err });
  }
});

