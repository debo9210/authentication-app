import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { errorsReducer } from './redux/reducers/errorReducer';
import { currentUserReducer } from './redux/reducers/authReducer';
import {
  userProfileReducer,
  createProfileReducer,
} from './redux/reducers/profileReducers';

const reducers = combineReducers({
  errors: errorsReducer,
  currentUser: currentUserReducer,
  userProfile: userProfileReducer,
  createProfile: createProfileReducer,
});

const initialState = {};

const middleware = [thunk];

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, devTools);

export default store;
