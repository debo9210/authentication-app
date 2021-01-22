import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import AuthComponent from './AuthComponent';
import InputComponent from './InputComponent';
import { loginUser } from '../redux/actions/authActions';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const errors = useSelector((state) => state.errors);

  const currentUser = useSelector((state) => state.currentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = () => {
    const userData = { email, password };

    dispatch(loginUser(userData));
  };

  const inputs = (
    <>
      <InputComponent
        iconType='mail'
        inputType='email'
        placeholder='Email'
        inputValueHandler={(e) => setEmail(e.target.value)}
        errorText={errors ? errors.email : null}
      />

      <InputComponent
        iconType='lock'
        inputType='password'
        placeholder='Password'
        inputValueHandler={(e) => setPassword(e.target.value)}
        errorText={errors ? errors.password : null}
      />
    </>
  );

  const memberOption = (
    <p className='Login-Register'>
      Already a member?{' '}
      <Link to='/'>
        <span>Register</span>
      </Link>
    </p>
  );

  const authBtn = (
    <button onClick={loginHandler} className='AuthBtn'>
      Login
    </button>
  );

  useEffect(() => {
    if (currentUser.isAuthenticated) {
      history.push('/personal-info');
    }
  }, [currentUser, history]);

  return (
    <div>
      <AuthComponent
        authHeading='Login'
        inputComponent={inputs}
        authBtn={authBtn}
        memberOption={memberOption}
      />
    </div>
  );
};

export default Login;
