const express = require('express');
const passport = require('passport');

const router = express.Router();

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000/login';

const SOCIAL_LOGIN_URL = 'http://localhost:3000/social-login';

router.get(
  '/facebook',
  passport.authenticate('facebook', { failureRedirect: CLIENT_HOME_PAGE_URL })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect(SOCIAL_LOGIN_URL);
  }
);

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: CLIENT_HOME_PAGE_URL }),
  (req, res) => {
    res.redirect(SOCIAL_LOGIN_URL);
  }
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: CLIENT_HOME_PAGE_URL }),
  (req, res) => {
    res.redirect(SOCIAL_LOGIN_URL);
  }
);

// router.get('/twitter', passport.authenticate('twitter'));

// router.get(
//   '/twitter/callback',
//   passport.authenticate('twitter', { failureRedirect: CLIENT_HOME_PAGE_URL }),
//   (req, res) => {
//     // console.log(res.session);
//     res.redirect(SOCIAL_LOGIN_URL);
//   }
// );

module.exports = router;
