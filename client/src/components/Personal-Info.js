import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../svg/devchallenges.svg';
import tempImage from '../images/noProfilePhoto.png';
import ProfileNav from '../components/ProfileNav';
import Loader from './Loader';
import { getUserProfile } from '../redux/actions/profileActions';
import { logoutUser, socialUserLogout } from '../redux/actions/authActions';
import axios from 'axios';

const PersonalInfo = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = useSelector((state) => state.currentUser);

  const { error, profileDetails, loading } = useSelector(
    (state) => state.userProfile
  );

  const deleteProfileHandler = () => {
    if (window.confirm('Are you sure? This action cannot be undone')) {
      axios
        .delete(`/api/profile/remove/${currentUser.user.id}`)
        .then(() => {
          if (currentUser.user.socialName) {
            dispatch(socialUserLogout());
          } else {
            dispatch(logoutUser());
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const profileSummary = (
    <>
      <header className='PersonalInfoHeader'>
        <h1 className='HeadingText'>Personal info</h1>
        <p className='HeadingAbout'>Basic info, like your name and photo</p>
      </header>
      <div className='ProfileInfoDisplay'>
        <div className='ProfileDetailsContainer ProfileDetailsContainerMobile'>
          <div className='ProfileHeading ProfileBox'>
            <div className='Profile'>
              <h3>Profile</h3>
              <p>Some info may be visible to other people</p>
            </div>
            <div className='ButtonGroup'>
              <button
                onClick={() => history.push('/update-profile')}
                className='EditBtn'
              >
                Edit
              </button>
              <button
                onClick={deleteProfileHandler}
                className='EditBtn DeleteBtn'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className='ProfileDetailsContainer PhotoHeight'>
          <div className='Photo ProfileBox'>
            <p className='DetailsHeading'>Photo</p>
            <div
              className='ProfileImage '
              style={{
                backgroundImage: `url(${!image ? tempImage : image})`,
              }}
            ></div>
          </div>
        </div>
        <div className='ProfileDetailsContainer'>
          <div className='ProfileBio ProfileBox'>
            <p className='DetailsHeading'>Name</p>
            <div className='ML'>
              <p className='BioDetails'>{name}</p>
            </div>
          </div>
        </div>
        <div className='ProfileDetailsContainer'>
          <div className='ProfileBio ProfileBox'>
            <p className='DetailsHeading'>Bio</p>
            <div className='ML'>
              <p className='BioDetails' title={bio}>
                {bio.substr(0, 51)}...
              </p>
            </div>
          </div>
        </div>
        <div className='ProfileDetailsContainer'>
          <div className='ProfileBio ProfileBox'>
            <p className='DetailsHeading'>phone</p>
            <div className='ML'>
              <p className='BioDetails'>
                {!phone ? 'No Phone provided' : phone}
              </p>
            </div>
          </div>
        </div>
        <div className='ProfileDetailsContainer EmailContainer'>
          <div className='ProfileBio ProfileBox'>
            <p className='DetailsHeading'>email</p>
            <div className='ML'>
              <p className='BioDetails'>{email}</p>
            </div>
          </div>
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
      setName(profileDetails.name);
      setBio(profileDetails.bio);
      setPhone(profileDetails.phone);
      setEmail(profileDetails.email);

      if (
        currentUser.user.socialName &&
        profileDetails.imageFileName === null
      ) {
        setImage(currentUser.user.image);
      } else {
        setImage(profileDetails.imageLink);
      }
    }

    if (error) {
      setErrorMsg(error.profile);
      if (errorMsg === 'There is no profile created for this user') {
        history.push('/create-profile');
      }
      // window.location.reload();
      // setErrorMsg('');
    }
  }, [profileDetails, error, history, errorMsg, currentUser]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }
  }, [currentUser, history, dispatch]);

  useEffect(() => {
    // console.log(currentUser.user.id);
    if (currentUser.user.id) {
      dispatch(getUserProfile(currentUser.user.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div>
      <ProfileNav
        BrandLogo={BrandLogo}
        image={loading ? tempImage : image}
        tempImage={tempImage}
        userName={currentUser.user.name}
      />

      {/* {profileSummary} */}
      {loading ? <Loader /> : profileSummary}
    </div>
  );
};

export default PersonalInfo;
