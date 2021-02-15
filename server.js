const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const colors = require('colors');
const cors = require('cors');
const path = require('path');

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

let url;
if (process.env.NODE_ENV === 'production') {
  url = 'http://localhost:3000';
} else {
  url = 'https://debo9210-auth-app.herokuapp.com/';
}

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
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
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
  // console.log('social login', req.user.id);
  const user = await User.findOne({ socialID: req.user.id });
  req.user = user;
  const userDetails = {
    user: req.user,
    userAccess: req.session.accessToken,
  };
  res.status(200).json(userDetails);
  next();
};

app.get('/social/login', async (req, res) => {
  const user = await User.findOne({ socialID: req.user.id });
  req.user = user;
  const userDetails = {
    user: req.user,
    userAccess: req.session.accessToken,
  };
  res.status(200).json(userDetails);
});

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

//server static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running @ port ${port}`.magenta);
});
