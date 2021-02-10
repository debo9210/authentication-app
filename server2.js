const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/passport2');
const isLoggedIn = require('./config/middlewareAuth');

app.use(
  cookieSession({
    name: 'twitter-auth-session',
    keys: ['key1', 'key2'],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
  res.send(`Hello world ${req.user.displayName}`);
});
app.get('/auth/error', (req, res) => res.send('Unknown Error'));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth/error' }),
  function (req, res) {
    res.redirect('/');
  }
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running @ port ${port}`);
});
