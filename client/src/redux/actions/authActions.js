import { GET_ERRORS, CLEAR_ERRORS, SET_CURRENT_USER } from '../constants';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// const config = {
//   header: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// };

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

//clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
