import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import BrandLogo from '../svg/devchallenges.svg';
import tempImage from '../images/noProfilePhoto.png';
import ProfileNav from '../components/ProfileNav';
import ProfileInputComponent from '../components/ProfileInputComponent';
import Loader from './Loader';
import { createUserProfile } from '../redux/actions/profileActions';

const CreateProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [picture, setPicture] = useState('');
  const [fileobj, setFileObj] = useState({});

  const currentUser = useSelector((state) => state.currentUser);
  const { error, loading, success } = useSelector(
    (state) => state.createProfile
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

  const createProfileHandler = () => {
    const formData = new FormData();
    formData.append('name', userName);
    formData.append('email', userEmail);
    formData.append('bio', userBio);
    formData.append('phone', userPhone);
    formData.append('uploads', fileobj);

    dispatch(createUserProfile(formData));
    // history.push('./personal-info');
  };

  const createProfile = (
    <>
      <h2 className='CreateProfileHeading'>
        You have no profile yet. Create one below...
      </h2>
      <div className='ProfileInfoDisplay'>
        <div className='CreateProfile'>
          <h3>Add Info</h3>
          <div className='AddPhotoContainer'>
            <div
              className='AddPhoto'
              style={{
                backgroundImage: `url(${picture ? picture : tempImage})`,
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
            inputInfo='* Change name?'
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
            ></textarea>
            <small className='createError' style={{ color: 'tomato' }}>
              {error && error.bio}
            </small>
          </div>

          <ProfileInputComponent
            labelName='Phone'
            inputType='text'
            placeholder='Enter your phone...'
            inputHandler={(e) => setUserPhone(e.target.value)}
          />

          <ProfileInputComponent
            labelName='Email'
            inputType='email'
            placeholder='Enter your email...'
            inputInfo='* Change email?'
            inputValue={userEmail}
            inputHandler={(e) => setUserEmail(e.target.value)}
            createError={error && error.email}
          />

          <button onClick={createProfileHandler} className='createInfoBtn'>
            Create
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
    if (success) {
      //   window.location.reload();
      history.push('/personal-info');
    }
  }, [success, history]);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.user.name);
      setUserEmail(currentUser.user.email);
    }

    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }
  }, [currentUser, history]);

  return (
    <>
      <ProfileNav
        BrandLogo={BrandLogo}
        tempImage={tempImage}
        userName={currentUser.user.name}
      />
      {loading ? <Loader /> : createProfile}
    </>
  );
};

export default CreateProfile;
