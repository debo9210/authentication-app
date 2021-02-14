const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: require('./keys').secretOrKey,
};

// const twitterAuth = require('./keys').twitterAuth;
const githubAuth = require('./keys').githubAuth;
const facebookAuth = require('./keys').facebookAuth;
const googleAuth = require('./keys').googleAuth;

let googleCredentials, facebookCredentials, githubCredentials;
if (process.env.NODE_ENV === 'production') {
  googleCredentials = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://debo9210-auth-app.herokuapp.com/auth/google/callback',
  };
  facebookCredentials = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:
      'https://debo9210-auth-app.herokuapp.com/auth/facebook/callback',
  };
  githubCredentials = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://debo9210-auth-app.herokuapp.com/auth/github/callback',
  };
} else {
  googleCredentials = {
    clientID: googleAuth.googleClientID,
    clientSecret: googleAuth.googleClientSecret,
    callbackURL: googleAuth.googleCallbackUrl,
  };
  facebookCredentials = {
    clientID: facebookAuth.facebookClientID,
    clientSecret: facebookAuth.facebookClientSecret,
    callbackURL: facebookAuth.facebookCallbackUrl,
  };
  githubCredentials = {
    clientID: githubAuth.githubClientID,
    clientSecret: githubAuth.githubClientSecret,
    callbackURL: githubAuth.githubCallbackUrl,
  };
}

module.exports = (passport) => {
  // serialize the user.id to save in the cookie session
  // so the browser will remember the user when login
  passport.serializeUser((user, cb) => {
    // console.log('from serialize', user);
    cb(null, user);
  });

  // deserialize the cookieUserId to user in the database
  // passport.deserializeUser((id, cb) => {
  //   console.log('from Deserialize', id.id);
  //   User.findOne({ socialID: id.id })
  //     .then((user) => {
  //       cb(null, user);
  //     })
  //     .catch((err) => {
  //       cb(new Error('Failed to deserialize user'));
  //     });
  // });
  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );

  // passport.use(
  //   new TwitterStrategy(
  //     {
  //       consumerKey: twitterAuth.twitterClientID,
  //       consumerSecret: twitterAuth.twitterClientSecret,
  //       callbackURL: twitterAuth.twitterCallbackUrl,
  //       includeEmail: true,
  //       // passReqToCallback: true,
  //     },
  //     async (req, token, tokenSecret, profile, done) => {
  //       //store user to database
  //       // console.log(req.passport);
  //       User.findOne({ socialID: profile.id }).then((user) => {
  //         if (user) {
  //           //update user in database
  //           const updateUser = {
  //             socialID: profile.id,
  //             name: profile.displayName,
  //             image: profile.photos[0].value,
  //             email: profile.emails[0].value,
  //             socialName: profile.provider,
  //           };

  //           User.findOneAndUpdate(
  //             { user: user._id },
  //             { $set: updateUser },
  //             { new: true }
  //           );
  //         } else {
  //           //create new user in database
  //           const newUser = new User({
  //             socialID: profile.id,
  //             name: profile.displayName,
  //             image: profile.photos[0].value,
  //             email: profile.emails[0].value,
  //             socialName: profile.provider,
  //           });
  //           newUser
  //             .save()
  //             .then((user) => done(null, user))
  //             .catch((err) => console.log(err));
  //         }
  //       });
  //       // console.log(profile);
  //       return done(null, profile);
  //     }
  //   )
  // );

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookCredentials.clientID,
        clientSecret: facebookCredentials.clientSecret,
        callbackURL: facebookCredentials.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        req.session.accessToken = accessToken;
        User.findOne({ socialID: profile.id }).then((user) => {
          if (user) {
            //update user in database
            const updateUser = {
              socialID: profile.id,
              name: profile.displayName,
              image: profile.photos[0].value,
              email: profile.emails[0].value,
              socialName: profile.provider,
            };

            User.findOneAndUpdate(
              { user: user._id },
              { $set: updateUser },
              { new: true }
            );
            // console.log(user.socialID);
          } else {
            //create new user in database
            const newUser = new User({
              socialID: profile.id,
              name: profile.displayName,
              image: profile.photos[0].value,
              email: profile.emails[0].value,
              socialName: profile.provider,
            });
            newUser
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
          // return done(null, profile);
        });
        // console.log(profile);
        return done(null, profile);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleCredentials.clientID,
        clientSecret: googleCredentials.clientSecret,
        callbackURL: googleCredentials.callbackURL,
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        req.session.accessToken = accessToken;
        // console.log(accessToken);
        // localStorage.setItem('jwtToken', `Bearer ${accesToken}`);
        //store user to database

        User.findOne({ socialID: profile.id }).then((user) => {
          if (user) {
            //create new user in database
            const updateUser = {
              socialID: profile.id,
              name: profile.displayName,
              firstName: profile.given_name,
              lastName: profile.family_name,
              image: profile.picture,
              email: profile.email,
              socialName: profile.provider,
            };

            User.findOneAndUpdate(
              { user: user._id },
              { $set: updateUser },
              { new: true }
            );
            // console.log(user.socialID);
          } else {
            const newUser = new User({
              socialID: profile.id,
              name: profile.displayName,
              firstName: profile.given_name,
              lastName: profile.family_name,
              image: profile.picture,
              email: profile.email,
              socialName: profile.provider,
            });
            newUser
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
        });
        return done(null, profile);
      }
    )
  );

  // clientID: githubCredentials.clientID,
  //     clientSecret: githubCredentials.clientSecret,
  //     callbackURL: githubCredentials.callbackURL,

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          'https://debo9210-auth-app.herokuapp.com/auth/github/callback',
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        req.session.accessToken = accessToken;
        let email;
        if (profile.email) {
          email = profile.email;
        } else {
          email = null;
        }

        User.findOne({ socialID: profile.id }).then((user) => {
          if (user) {
            //create new user in database
            const updateUser = {
              socialID: profile.id,
              name: profile.displayName,
              image: profile.photos[0].value,
              email: email,
              socialName: profile.provider,
            };

            User.findOneAndUpdate(
              { user: user._id },
              { $set: updateUser },
              { new: true }
            );
            // console.log(user.socialID);
          } else {
            const newUser = new User({
              socialID: profile.id,
              name: profile.displayName,
              image: profile.photos[0].value,
              email: email,
              socialName: profile.provider,
            });
            newUser
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
        });
        // console.log(profile);
        return done(null, profile);
      }
    )
  );
};
