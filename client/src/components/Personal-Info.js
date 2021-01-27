import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../svg/devchallenges.svg';
import tempImage from '../images/noProfilePhoto.png';
import ProfileNav from '../components/ProfileNav';
import { getUserProfile } from '../redux/actions/profileActions';

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

  const { error, profileDetails } = useSelector((state) => state.userProfile);

  const profileSummary = (
    <>
      <header className='PersonalInfoHeader'>
        <h1 className='HeadingText'>Personal info</h1>
        <p className='HeadingAbout'>Basic info, like your name and photo</p>
      </header>
      <div className='ProfileInfoDisplay'>
        <div className='ProfileDetailsContainer'>
          <div className='ProfileHeading ProfileBox'>
            <div className='Profile'>
              <h3>Profile</h3>
              <p>Some info may be visible to other people</p>
            </div>
            <button
              onClick={() => history.push('/update-profile')}
              className='EditBtn'
            >
              Edit
            </button>
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
      setImage(profileDetails.imageLink);
      setPhone(profileDetails.phone);
      setEmail(profileDetails.email);
    }

    if (error) {
      setErrorMsg(error.profile);
      if (errorMsg === 'There is no profile created for this user') {
        history.push('/create-profile');
      }
      window.location.reload();
      // setErrorMsg('');
    }
  }, [profileDetails, error, history, errorMsg]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }
    dispatch(getUserProfile(currentUser.user.id));
  }, [currentUser, history, dispatch]);

  return (
    <div>
      <ProfileNav
        BrandLogo={BrandLogo}
        image={image}
        tempImage={tempImage}
        userName={currentUser.user.name}
      />

      {/* {profileSummary} */}
      {profileSummary}
    </div>
  );
};

export default PersonalInfo;
