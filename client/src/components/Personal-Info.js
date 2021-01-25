import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import BrandLogo from '../svg/devchallenges.svg';
import tempImage from '../images/noProfilePhoto.png';
import ProfileInputComponent from '../components/ProfileInputComponent';
import { logoutUser } from '../redux/actions/authActions';
import {
  getUserProfile,
  createUserProfile,
} from '../redux/actions/profileActions';

const PersonalInfo = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState('');

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [fileobj, setFileObj] = useState({});

  const [create, setCreate] = useState(false);
  const [summary, setSummary] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);

  const { error, profileDetails } = useSelector((state) => state.userProfile);

  const { error: createError, loading } = useSelector(
    (state) => state.createProfile
  );

  const DropDownContainerRef = useRef(null);

  // let convertPwd = [];
  // if (currentUser) {
  //   const PASSWORD = currentUser.user.password.substr(0, 12).split('');
  //   for (let i = 0; i < PASSWORD.length; i++) {
  //     convertPwd.push((PASSWORD[i] = '*'));
  //   }
  // }

  const showDropDown = (e) => {
    if (e.target.textContent === 'arrow_drop_down') {
      e.target.textContent = 'arrow_drop_up';
      DropDownContainerRef.current.style.display = 'block';
    } else {
      e.target.textContent = 'arrow_drop_down';
      DropDownContainerRef.current.style.display = 'none';
    }
  };

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

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
    console.log(fileobj);

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('email', userEmail);
    formData.append('bio', userBio);
    formData.append('phone', userPhone);
    formData.append('uploads', fileobj);

    dispatch(createUserProfile(formData));
  };

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
            <button className='EditBtn'>Edit</button>
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
        {/* <div className='ProfileDetailsContainer PasswordContainer'>
          <div className='ProfileBio ProfileBox'>
            <p className='DetailsHeading'>password</p>
            <div className='ML'>
              <p className='BioDetails'>password</p>
            </div>
          </div>
        </div> */}
      </div>
      <div className='CopyRight CopyProfileInfo'>
        <p className='CopyText'>debo9210</p>
        <p className='CopyText'>devchallenges.io</p>
      </div>
    </>
  );

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
            createError={createError && createError.name}
          />

          <div className='ProfileInputGroup'>
            <label className='LabelName'>Bio</label>
            <textarea
              className='BioInfo'
              placeholder='Enter your bio...'
              onChange={(e) => setUserBio(e.target.value)}
            ></textarea>
            <small className='createError' style={{ color: 'tomato' }}>
              {createError && createError.bio}
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
            createError={createError && createError.email}
          />

          <button onClick={createProfileHandler} className='createInfoBtn'>
            save
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
      setName(profileDetails.name);
      setBio(profileDetails.bio);
      setImage(profileDetails.imageLink);
      setPhone(profileDetails.phone);
      setEmail(profileDetails.email);
    }

    if (error) {
      // setCreate(true);
      // setSummary(false);
    }
  }, [profileDetails, error]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }

    if (currentUser) {
      setUserName(currentUser.user.name);
      setUserEmail(currentUser.user.email);
    }
    dispatch(getUserProfile(currentUser.user.id));
  }, [currentUser, history, dispatch]);

  return (
    <div>
      <div className='PersonalInfo'>
        <nav className='PersonalInfoNav'>
          <div className='BrandContainer'>
            <img src={BrandLogo} alt='Brand' className='Brand' />
          </div>

          <div className='UserInfoContainer'>
            <div className='UserInfo'>
              <div
                className='UserImage'
                style={{
                  backgroundImage: `url(${!image ? tempImage : image})`,
                }}
              ></div>
              <p className='UserName'>{currentUser.user.name}</p>
              <i
                onClick={showDropDown}
                className='material-icons ArrowDownIcon'
              >
                arrow_drop_down
              </i>
            </div>

            <div className='DropDownContainer' ref={DropDownContainerRef}>
              <div className='DropDown'>
                <div className='DropDownItem'>
                  <i className='material-icons DropDownIcon'>account_circle</i>
                  <p className='IconName'>My Profile</p>
                </div>
                <div className='DropDownItem'>
                  <i className='material-icons DropDownIcon'>group</i>
                  <p className='IconName'>Group Chat</p>
                </div>

                <div className='LogOut'>
                  <div onClick={logoutHandler} className='DropDownItem'>
                    <i className='material-icons DropDownIcon ExitIcon'>
                      exit_to_app
                    </i>
                    <p className='IconName ExitIcon'>Logout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {error ? createProfile : profileSummary}
        {/* {create && createProfile}
        {summary && profileSummary} */}
      </div>
    </div>
  );
};

export default PersonalInfo;
