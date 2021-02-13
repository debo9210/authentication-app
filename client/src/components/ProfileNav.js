import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { logoutUser, socialUserLogout } from '../redux/actions/authActions';

const ProfileNav = ({ BrandLogo, image, tempImage, userName }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector((state) => state.currentUser);

  // console.log(currentUser.user.socialName);

  const DropDownContainerRef = useRef(null);
  // const arrowRef = useRef(null);

  const showDropDown = (e) => {
    if (e.target.textContent === 'arrow_drop_down') {
      e.target.textContent = 'arrow_drop_up';
      DropDownContainerRef.current.style.display = 'block';
    } else {
      e.target.textContent = 'arrow_drop_down';
      DropDownContainerRef.current.style.display = 'none';
    }
  };

  const profileHandler = () => {
    // history.push('/personal-info');
  };

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  const socialLogoutHandler = () => {
    dispatch(socialUserLogout(history));
  };
  return (
    <>
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
              <p className='UserName'>{userName}</p>
              <i
                onClick={showDropDown}
                className='material-icons ArrowDownIcon'
                // ref={arrowRef}
              >
                arrow_drop_down
              </i>
            </div>

            <div className='DropDownContainer' ref={DropDownContainerRef}>
              <div className='DropDown'>
                <div className='DropDownItem' onClick={profileHandler}>
                  <i className='material-icons DropDownIcon'>account_circle</i>
                  <Link to='/personal-info'>
                    <p className='IconName'>My Profile</p>
                  </Link>
                </div>
                <div className='DropDownItem'>
                  <i className='material-icons DropDownIcon'>group</i>
                  <p className='IconName'>Group Chat</p>
                </div>

                <div className='LogOut'>
                  <div
                    onClick={
                      !currentUser.user.socialName
                        ? logoutHandler
                        : socialLogoutHandler
                    }
                    className='DropDownItem'
                  >
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
      </div>
    </>
  );
};

export default ProfileNav;
