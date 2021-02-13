import {
  GET_PROFILE_FAIL,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  RESET_STATE,
} from '../constants';

const initialState = {
  success: false,
};

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

export const createProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROFILE_REQUEST:
      return { ...state, loading: true };
    case CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case RESET_STATE:
      return {
        success: false,
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

export const updateProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_PROFILE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case RESET_STATE:
      return {
        success: false,
      };
    case UPDATE_PROFILE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
