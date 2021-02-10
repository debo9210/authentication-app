import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { socialLogin } from '../redux/actions/authActions';
import Loader from './Loader';
// import axios from 'axios';

const SocialLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(socialLogin(history));
  }, [dispatch, history]);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default SocialLogin;
