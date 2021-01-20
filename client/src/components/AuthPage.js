import React, { useState, useRef } from 'react';
import DevLogo from '../svg/devchallenges.svg';
import GoogleLogo from '../svg/Google.svg';
import FacebookLogo from '../svg/Facebook.svg';
import TwitterLogo from '../svg/Twitter.svg';
import GithubLogo from '../svg/Github.svg';

const AuthPage = () => {
  const [login, setLogin] = useState(true);
  const [register, setRegister] = useState(false);

  const AuthHeadingRef = useRef(null);
  const LoginHeadingRef = useRef(null);
  const InputDivRef = useRef(null);

  const changeLogin = () => {
    setLogin(false);
    setRegister(true);
    AuthHeadingRef.current.style.display = 'none';
    LoginHeadingRef.current.style.display = 'block';
    InputDivRef.current.style.display = 'none';
  };

  const changeRegister = () => {
    setLogin(true);
    setRegister(false);
    AuthHeadingRef.current.style.display = 'block';
    LoginHeadingRef.current.style.display = 'none';
    InputDivRef.current.style.display = 'block';
  };

  const Login = (
    <p className='Login-Register'>
      Already a member? <span onClick={changeLogin}>Login</span>
    </p>
  );

  const Register = (
    <p className='Login-Register'>
      Don’t have an account yet? <span onClick={changeRegister}>Register</span>
    </p>
  );

  return (
    <div className='AuthContainer'>
      <div className='AuthPage'>
        <div className='Auth'>
          <img className='Brand' src={DevLogo} alt='Brand' />
          <div className='AuthHeadingContainer' ref={AuthHeadingRef}>
            <h4 className='AuthHeading'>
              Join thousands of learners from around the world
            </h4>

            <p className='AuthAbout'>
              Master web development by making real-life projects. There are
              multiple paths for you to choose
            </p>
          </div>

          <div className='LoginHeadingContainer' ref={LoginHeadingRef}>
            <h4 className='LoginText'>Login</h4>
          </div>

          <div className='InputGrouping'>
            <div className='NameDivContainer' ref={InputDivRef}>
              <div className='InputGroup'>
                <i className='material-icons InputIcon'>person</i>
                <input type='text' placeholder='Name' />
              </div>
            </div>
            <div className='InputGroup'>
              <i className='material-icons InputIcon'>mail</i>
              <input type='email' placeholder='Email' />
            </div>

            <div className='InputGroup'>
              <i className='material-icons InputIcon'>lock</i>
              <input type='password' placeholder='Password' />
            </div>

            {login && <button className='AuthBtn'>Start coding now </button>}

            {register && <button className='AuthBtn'>Login</button>}
          </div>

          <p className='SocialConnect'>or continue with these social profile</p>

          <div className='SocialGroup'>
            <img src={GoogleLogo} alt='google' />
            <img src={FacebookLogo} alt='facebook' />
            <img src={TwitterLogo} alt='twitter' />
            <img src={GithubLogo} alt='github' />
          </div>

          {login && Login}
          {register && Register}
        </div>
      </div>
      <div className='CopyRight'>
        <p className='CopyText'>debo9210</p>
        <p className='CopyText'>devchallenges.io</p>
      </div>
    </div>
  );
};

export default AuthPage;
