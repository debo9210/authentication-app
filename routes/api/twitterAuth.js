const express = require('express');
const passport = require('passport');

const router = express.Router();

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000/personal-info';

// @Route GET api/auth/twitter
// @Desc get user details from twitter
// @Access Public

// when login is successful, retrieve user info
// router.get('/login/success', (req, res) => {
//   if (req.user) {
//     res.json({
//       success: true,
//       message: 'user has successfully authenticated',
//       user: req.user,
//       // cookies: req.cookies,
//     });
//   }
//   console.log('login', req.session);
// });

// when login failed, send failed msg
// router.get('/login/failed', (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: 'user failed to authenticate.',
//   });
// });

// When logout, redirect to client
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect(CLIENT_HOME_PAGE_URL);
// });

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    // failureRedirect: '/api/users/login/failed',
  })
);

module.exports = router;
