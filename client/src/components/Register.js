import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import AuthComponent from './AuthComponent';
import InputComponent from './InputComponent';
import { registerUser } from '../redux/actions/authActions';

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const errors = useSelector((state) => state.errors);
  const currentUser = useSelector((state) => state.currentUser);

  const registerHandler = () => {
    const formData = {
      name,
      email,
      password,
      password2,
    };

    dispatch(registerUser(formData, history));
  };

  const inputs = (
    <>
      <InputComponent
        iconType='person'
        inputType='text'
        placeholder='Name'
        errorText={errors ? errors.name : null}
        inputValueHandler={(e) => setName(e.target.value)}
      />

      <InputComponent
        iconType='mail'
        inputType='email'
        placeholder='Email'
        errorText={errors ? errors.email : null}
        inputValueHandler={(e) => setEmail(e.target.value)}
      />

      <InputComponent
        iconType='lock'
        inputType='password'
        placeholder='Password'
        errorText={errors ? errors.password : null}
        inputValueHandler={(e) => setPassword(e.target.value)}
      />

      <InputComponent
        iconType='lock'
        inputType='password'
        placeholder='Confirm Password'
        errorText={errors ? errors.password2 : null}
        inputValueHandler={(e) => setPassword2(e.target.value)}
      />
    </>
  );

  const memberOption = (
    <p className='Login-Register'>
      Already a member?{' '}
      <Link to='/login'>
        <span>Login</span>
      </Link>
    </p>
  );

  const authBtn = (
    <button onClick={registerHandler} className='AuthBtn'>
      Start coding now
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
        authHeading='Join thousands of learners from around the world'
        authAbout='Master web development by making real-life projects. There are multiple paths for you to choose'
        inputComponent={inputs}
        authBtn={authBtn}
        memberOption={memberOption}
      />
    </div>
  );
};

export default Register;
