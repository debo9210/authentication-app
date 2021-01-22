import React from 'react';
import DevLogo from '../svg/devchallenges.svg';
import GoogleLogo from '../svg/Google.svg';
import FacebookLogo from '../svg/Facebook.svg';
import TwitterLogo from '../svg/Twitter.svg';
import GithubLogo from '../svg/Github.svg';

const AuthComponent = ({
  authHeading,
  authAbout,
  inputComponent,
  authBtn,
  memberOption,
}) => {
  return (
    <div className='AuthContainer'>
      <div className='AuthPage'>
        <div className='Auth'>
          <img className='Brand' src={DevLogo} alt='Brand' />
          <div className='AuthHeadingContainer'>
            <h4 className='AuthHeading'>{authHeading}</h4>

            <p className='AuthAbout'>{authAbout}</p>
          </div>

          <div className='InputGrouping'>
            {inputComponent}
            {authBtn}
          </div>

          <p className='SocialConnect'>or continue with these social profile</p>

          <div className='SocialGroup'>
            <img src={GoogleLogo} alt='google' />
            <img src={FacebookLogo} alt='facebook' />
            <img src={TwitterLogo} alt='twitter' />
            <img src={GithubLogo} alt='github' />
          </div>

          {memberOption}
        </div>
      </div>
      <div className='CopyRight'>
        <p className='CopyText'>debo9210</p>
        <p className='CopyText'>devchallenges.io</p>
      </div>
    </div>
  );
};

export default AuthComponent;
