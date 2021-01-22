import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../svg/devchallenges.svg';
import tempImage from '../svg/Facebook.svg';
import { logoutUser } from '../redux/actions/authActions';

const PersonalInfo = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.currentUser);

  const DropDownContainerRef = useRef(null);

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

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      history.push('/login');
    }
  }, [currentUser, history]);

  return (
    <div className='PersonalInfo'>
      <header className='PersonalInfoHeader'>
        <div className='BrandContainer'>
          <img src={BrandLogo} alt='Brand' className='Brand' />
        </div>

        <div className='UserInfoContainer'>
          <div className='UserInfo'>
            <div
              className='UserImage'
              style={{ backgroundImage: `url(${tempImage})` }}
            ></div>
            <p className='UserName'>Arya Stark</p>
            <i onClick={showDropDown} className='material-icons ArrowDownIcon'>
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
      </header>
    </div>
  );
};

export default PersonalInfo;
