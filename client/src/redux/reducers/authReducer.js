import { SET_CURRENT_USER } from '../constants';
import isEmpty from '../../validation/isEmpty';

const initialState = {
  isAuthenticated: false,
  user: {},
};

export const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
};
