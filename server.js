const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');

const users = require('./routes/api/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//db config
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to database'.yellow))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello, Worldie!');
});

//Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running @ port ${port}`.magenta);
});
