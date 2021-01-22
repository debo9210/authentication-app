const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys').secretOrKey;

const router = express.Router();

//load user model
const User = require('../../models/User');

//load register input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @Route POST api/users/register
// @Desc route to register users
// @Access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //check is user already exists
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      // create new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      //hash user password and save to db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @Route Post api/users/login
// @Desc route to login user / return jwt token
// @Access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    //check for user
    if (!user) {
      errors.email = 'User not found, register yet?';
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      //user matched
      if (isMatch) {
        //user matched

        //create jwt payload
        const payload = {
          id: user._id,
          name: user.name,
          email: user.email,
        };

        //sign Token
        jwt.sign(payload, keys, { expiresIn: 3600 * 2 }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @Route GET api/users/current
// @Desc Return current user route
// @Access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
