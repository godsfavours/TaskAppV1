const express = require('express');
const app = express();

app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'pages'));

// parse html
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// To use PUT/PATCH/DELETE
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


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
    enum: ['None', 'Low', 'Medium', 'High']
  }
})

const Task = mongoose.model('Task', taskSchema);

// Application routes
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

app.post('/tasks', async (req, res) => {
  const { title, priority } = req.body;
  console.log(title);
  // assert that the stuff is good
  Task.create({ title, priority, lastUpdated: Date.now() },
    function (err, task) {
      if (err) {
        console.log('Cannot add task.');
        console.log(err);
        res.render('error', { errorMsg: err });
      }
      res.redirect(`tasks/${task.id}`);
    });
})

app.get('/tasks/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('edit', { task });
  } catch (err) {
    console.log('Cannot load edit page.');
    console.log(err);
    res.render('error', { errorMsg: err });
  }
})

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, priority, description } = req.body;
    const task = await Task.findByIdAndUpdate(id,
      { title, priority, description, lastUpdated: Date.now() });
    res.redirect(`/tasks/${task.id}`);
  } catch (err) {
    console.log('Cannot edit task.');
    console.log(err);
    res.render('error', { errorMsg: err });
  }
})