import React from 'react';
import DevLogo from '../svg/devchallenges.svg';
import GoogleLogo from '../svg/Google.svg';
import FacebookLogo from '../svg/Facebook.svg';
// eslint-disable-next-line
import TwitterLogo from '../svg/Twitter.svg';
import GithubLogo from '../svg/Github.svg';
import SocialLogin from './SocialLoginComponent';

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
            <SocialLogin socialLogo={GoogleLogo} socialName='google' />
            <div>
              <SocialLogin socialLogo={FacebookLogo} socialName='facebook' />
            </div>
            {/* <div className='SocialLinkContainer'>
              <SocialLogin socialLogo={TwitterLogo} socialName='twitter' />
            </div> */}
            <div className=''>
              <SocialLogin socialLogo={GithubLogo} socialName='github' />
            </div>
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
