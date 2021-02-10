const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const colors = require('colors');
const cors = require('cors');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const socialAuth = require('./routes/api/socialAuth');

//load user model
const User = require('./models/User');

const app = express();

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

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  })
);

// app.use(cors());

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express session middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

//Passport config
require('./config/passport')(passport);

app.get('/user', async (req, res, next) => {
  res.send(`Hello world`);
  // console.log(req.session);
  // console.log(req.user);
  // const user = await User.findOne({ socialID: req.user.id });
  // req.user = user;
  // res.status(200).json(req.user);
  next();
});

const isSignedIn = async (req, res, next) => {
  const user = await User.findOne({ socialID: req.user.id });
  req.user = user;
  res.status(200).json(req.user);
  next();
};

app.get('/social/login', isSignedIn);

app.delete('/delete', (req, res) => {
  req.session.destroy();
  req.logOut();
  // res.send('deleted');
  // res.redirect('http://localhost:3000/login');
});

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/auth', socialAuth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running @ port ${port}`.magenta);
});
