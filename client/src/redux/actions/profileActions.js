import axios from 'axios';
import {
  CREATE_PROFILE_FAIL,
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
} from '../constants';

export const getUserProfile = (id) => async (dispatch) => {
  // console.log(localStorage.jwtToken);

  const config = {
    headers: {
      Authorization: localStorage.jwtToken,
    },
  };

  try {
    dispatch({ type: GET_PROFILE_REQUEST });

    const { data } = await axios.get(`/api/profile/${id}`);

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: error.response.data,
    });
  }
};

export const createUserProfile = (formData) => (dispatch) => {
  const config = {
    headers: {
      Authorization: localStorage.jwtToken,
      'Content-Type': 'multipart/form-data',
    },
  };

  dispatch({ type: CREATE_PROFILE_REQUEST });

  axios
    .post(`api/profile/`, formData, config)
    .then(() =>
      dispatch({
        type: CREATE_PROFILE_SUCCESS,
      })
    )
    .catch((err) =>
      dispatch({
        type: CREATE_PROFILE_FAIL,
        payload: err.response.data,
      })
    );
};
