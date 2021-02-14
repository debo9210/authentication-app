import { GET_ERRORS, CLEAR_ERRORS, SET_CURRENT_USER } from '../constants';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

let socialUrlLogin;
if (process.env.NODE_ENV === 'production') {
  socialUrlLogin = 'https://debo9210-auth-app.herokuapp.com/social/login';
} else {
  socialUrlLogin = '/social/login';
}

// register user
export const registerUser = (formData, history) => (dispatch) => {
  dispatch(clearErrors());

  axios
    .post(`/api/users/register`, formData)
    .then(() => history.push('/login'))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//login get user token
export const loginUser = (formData) => (dispatch) => {
  dispatch(clearErrors());

  axios
    .post(`/api/users/login`, formData)
    .then((res) => {
      //save token to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);

      // set token to auth headers
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);

      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//social login users
export const socialLogin = (history) => (dispatch) => {
  const expTime = new Date();
  expTime.setHours(expTime.getHours() + 6);
  axios
    .get(socialUrlLogin)
    .then((res) => {
      // console.log(res.data);
      const userDetails = {
        id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        socialName: res.data.user.socialName,
        image: res.data.user.image,
        iat: Date.now(),
        exp: Date.parse(expTime),
      };

      const accessToken = `Bearer ${res.data.userAccess}`;
      localStorage.setItem('socialUser', JSON.stringify(userDetails));
      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      setAuthToken(accessToken);
      dispatch(setCurrentUser(userDetails));
      history.push('/personal-info');
    })
    .catch((err) => console.log(err));
};

//set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//log user out
export const logoutUser = () => (dispatch) => {
  //remove token from local storage
  localStorage.removeItem('jwtToken');

  //remove auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const socialUserLogout = () => (dispatch) => {
  localStorage.removeItem('socialUser');
  localStorage.removeItem('accessToken');
  //remove auth header for future requests
  setAuthToken(false);
  axios
    .delete('/api/users/logout')
    .then()
    .catch((err) => console.log(err));
  dispatch(setCurrentUser({}));
};

//clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
