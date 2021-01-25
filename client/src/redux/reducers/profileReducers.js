import {
  GET_PROFILE_FAIL,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAIL,
} from '../constants';

export const userProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
      return { ...state, loading: true };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profileDetails: action.payload,
      };
    case GET_PROFILE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const createProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_PROFILE_REQUEST:
      return { ...state, loading: true };
    case CREATE_PROFILE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case CREATE_PROFILE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
