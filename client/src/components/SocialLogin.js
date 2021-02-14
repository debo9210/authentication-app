import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { socialLogin } from '../redux/actions/authActions';
import Loader from './Loader';
// import axios from 'axios';

const SocialLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    // if (!currentUser.isAuthenticated && !currentUser.user.socialName) {
    //   history.push('/login');
    // }

    dispatch(socialLogin(history));
  }, [dispatch, history, currentUser]);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default SocialLogin;
