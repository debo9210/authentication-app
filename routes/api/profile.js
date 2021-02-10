const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const gravatar = require('gravatar');
const Validator = require('validator');

//db config
const mongoURI = require('../../config/keys').mongoURI;

// Load Profile model
const Profile = require('../../models/Profile');
//load user profile
const User = require('../../models/User');

//profile input validation
const validateProfileInput = require('../../validation/profile');

//create mongoose connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Init gfs and gridFSBucket
let gfs;
let gridFSBucket;

conn.once('open', () => {
  //init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gfs.collection('uploads');
});

//create storage engine
const storage = GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }
        const fileName = buff.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          fileName,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const maxSize = 3 * 1000 * 1000;
const upload = multer({ storage, limits: { fileSize: maxSize } });

// @Route Get api/profile/:id
// @Desc get user Profile by user id
// @Access Private
router.get('/:id', (req, res) => {
  // console.log(req.user.id);
  // console.log(req.params.id);
  const errors = {};
  Profile.findOne({ user: req.params.id }).then((profile) => {
    if (!profile) {
      errors.profile = 'There is no profile created for this user';
      return res.status(400).json(errors);
    } else {
      return res.json(profile);
    }
  });
});

// @Route Get api/profile/image/:id
// @Desc stream profile image to browser
// @Access Public
router.get('/image/:id', (req, res) => {
  let errors = {};

  Profile.findOne({ imageFileName: req.params.id }).then((profile) => {
    if (!profile) {
      errors.profile = 'No image for the specified ID';
      return res.status(404).json(errors);
    }

    gfs.files.findOne({ filename: profile.imageFileName }, (err, file) => {
      if (err) throw err;
      //check if files exist
      if (!file || file.length === 0) {
        errors.profileImage = 'No file exists';
        return res.status(404).json(errors);
      }

      //check contentType
      if (
        file.contentType === 'image/jpeg' ||
        file.contentType === 'image/jpg' ||
        file.contentType === 'png'
      ) {
        //read stream to browser
        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
      } else {
        errors.fileError = 'Not an image';
        return res.status(404).json(errors);
      }
    });
  });
});

// @Route Post api/profile
// @Desc create user Profile
// @Access Private
router.post('/:id', upload.single('uploads'), (req, res) => {
  // console.log(req.body);
  // console.log(req.user);
  const { errors, isValid } = validateProfileInput(req.body);

  const url = req.protocol + '://' + req.get('host');
  let image;
  let imageFile;
  if (!req.file) {
    //   errors.imageLink =
    //     'An image is required, Only .png, .jpg and .jpeg format allowed! max 3mb.';

    const url = gravatar.url(`${req.body.email}`, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    image = url;
    imageFile = null;
    //   return res.status(400).json(errors);
  } else {
    image = `${url}/api/profile/image/${req.file.filename}`;
    imageFile = req.file.filename;
  }

  //vaidate input
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //check if user has profile
  Profile.findOne({ user: req.params.id }).then((profile) => {
    if (profile) {
      errors.user = 'This user already has a profile created';
      return res.status(400).json(errors);
    } else {
      //create new profile
      const newProfile = new Profile({
        user: req.params.id,
        name: req.body.name,
        imageLink: image,
        imageFileName: imageFile,
        email: req.body.email,
        bio: req.body.bio,
        phone: req.body.phone,
      });

      // newProfile
      //   .save()
      //   .then((profile) => res.json(profile))
      //   .catch((err) => res.status(400).json(err));
    }
  });
});

// @Route Put api/profile/createProfile
// @Desc update user Profile
// @Access Private
router.put('/:id', upload.single('uploads'), (req, res) => {
  // console.log(req.file);
  const { errors, isValid } = validateProfileInput(req.body);

  //validate input
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.file) {
    Profile.findOne({ user: req.params.id })
      .then((profile) => {
        if (req.file.filename !== profile.imageFileName) {
          gfs.remove({
            filename: profile.imageFileName,
            root: 'uploads',
          });
        }
      })
      .catch((err) => console.log(err));
  }

  const url = req.protocol + '://' + req.get('host');

  const profileFields = {};

  if (!req.file) {
    profileFields.name = req.body.name;
    profileFields.email = req.body.email;
    profileFields.bio = req.body.bio;
    profileFields.phone = req.body.phone;
  } else {
    profileFields.name = req.body.name;
    profileFields.imageLink = `${url}/api/profile/image/${req.file.filename}`;
    profileFields.imageFileName = req.file.filename;
    profileFields.email = req.body.email;
    profileFields.bio = req.body.bio;
    profileFields.phone = req.body.phone;
  }

  //update user email and password
  if (req.body.password !== '') {
    if (!Validator.isLength(req.body.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be between 6 and 30 characters';
      return res.status(400).json(errors);
    }

    const userUpdate = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userUpdate.password, salt, (err, hash) => {
        if (err) throw err;
        userUpdate.password = hash;
        User.findByIdAndUpdate(req.user.id, { $set: userUpdate }, { new: true })
          .then()
          .catch((err) => console.log(err));
      });
    });
  }

  Profile.findOneAndUpdate(
    { user: req.params.id },
    { $set: profileFields },
    { new: true }
  )
    .then((profile) => {
      return res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
});

// @Route Del api/profile/remove
// @Desc delete user Profile
// @Access Private
router.delete('/remove/:id', (req, res) => {
  Profile.findOneAndRemove({ user: req.params.id }).then((profile) => {
    User.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        gfs.remove({ filename: profile.imageFileName, root: 'uploads' });
      })
      .then(() => {
        res.json({ success: true });
      });
  });
});

module.exports = router;
