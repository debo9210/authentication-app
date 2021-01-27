import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ProfileNav from './ProfileNav';
import BrandLogo from '../svg/devchallenges.svg';
import ProfileInputComponent from './ProfileInputComponent';
import Loader from './Loader';
import {
  getUserProfile,
  updateUserProfile,
} from '../redux/actions/profileActions';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [image, setImage] = useState('');

  const [picture, setPicture] = useState('');
  const [fileObj, setFileObj] = useState({});
  const [userName, setUserName] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const currentUser = useSelector((state) => state.currentUser);
  const { profileDetails } = useSelector((state) => state.userProfile);

  const { error, success, loading } = useSelector(
    (state) => state.updateProfile
  );

  const inputFileHandler = (e) => {
    let reader;
    if (e.target.files && e.target.files[0]) {
      reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = function () {
        setPicture(reader.result);
      };
    }
    setFileObj(e.target.files[0]);
  };

  const updateProfileHandler = () => {
    // console.log(userName, userBio, userEmail);
    const formData = new FormData();
    formData.append('name', userName);
    formData.append('bio', userBio);
    formData.append('phone', userPhone);
    formData.append('email', userEmail);
    formData.append('password', userPassword);
    formData.append('uploads', fileObj);
    dispatch(updateUserProfile(formData));

    setTimeout(() => {
      if (success) {
        history.push('/personal-info');
      }
    }, 500);
  };

  const updateProfileCont = (
    <>
      <div className='BackContainer'>
        <i className='material-icons ArrowBackIcon'>arrow_back_ios</i>
        <Link to='/personal-info'>
          <p>Back</p>
        </Link>
      </div>
      <div className='ProfileInfoDisplay'>
        <div className='CreateProfile'>
          <h3>Change Info</h3>
          <p>Changes will be reflected to every services</p>
          <div className='AddPhotoContainer'>
            <div
              className='AddPhoto'
              style={{
                backgroundImage: `url(${picture ? picture : image})`,
              }}
            >
              <i className='material-icons CameraIcon'>photo_camera</i>
            </div>
            <div className='FileUploadContainer'>
              <label htmlFor='file-upload' className='FileBtn'>
                add photo
              </label>
              <input
                id='file-upload'
                type='file'
                name='uploads'
                onChange={inputFileHandler}
              />
            </div>
          </div>

          <ProfileInputComponent
            labelName='Name'
            inputType='text'
            placeholder='Enter your name...'
            inputValue={userName}
            inputHandler={(e) => setUserName(e.target.value)}
            createError={error && error.name}
          />

          <div className='ProfileInputGroup'>
            <label className='LabelName'>Bio</label>
            <textarea
              className='BioInfo'
              placeholder='Enter your bio...'
              onChange={(e) => setUserBio(e.target.value)}
              value={userBio}
            ></textarea>
            <small className='createError' style={{ color: 'tomato' }}>
              {error && error.bio}
            </small>
          </div>

          <ProfileInputComponent
            labelName='Phone'
            inputType='text'
            placeholder='Enter your phone...'
            inputValue={userPhone}
            inputHandler={(e) => setUserPhone(e.target.value)}
          />

          <ProfileInputComponent
            labelName='Email'
            inputType='email'
            placeholder='Enter your email...'
            inputValue={userEmail}
            inputHandler={(e) => setUserEmail(e.target.value)}
            createError={error && error.email}
          />

          <ProfileInputComponent
            labelName='Password'
            inputType='password'
            placeholder='Enter your password...'
            inputValue={userPassword}
            inputHandler={(e) => setUserPassword(e.target.value)}
            inputInfo='* changing password will affect login process'
            createError={error && error.password}
          />

          <button onClick={updateProfileHandler} className='createInfoBtn'>
            Update
          </button>
        </div>
      </div>
      <div className='CopyRight CopyProfileInfo'>
        <p className='CopyText'>debo9210</p>
        <p className='CopyText'>devchallenges.io</p>
      </div>
    </>
  );

  useEffect(() => {
    if (profileDetails) {
      setImage(profileDetails.imageLink);
      setUserName(profileDetails.name);
      setUserBio(profileDetails.bio);
      setUserPhone(profileDetails.phone);
      setUserEmail(profileDetails.email);
    }
  }, [profileDetails]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }
  }, [currentUser, history]);

  useEffect(() => {
    dispatch(getUserProfile(currentUser.user.id));
  }, [dispatch, currentUser]);

  return (
    <>
      <ProfileNav
        BrandLogo={BrandLogo}
        tempImage={image}
        userName={currentUser.user.name}
      />

      {loading ? <Loader /> : updateProfileCont}
    </>
  );
};

export default UpdateProfile;
