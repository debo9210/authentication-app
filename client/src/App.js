import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authActions';
import store from './store';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import PersonalInfo from './components/Personal-Info';
import CreateProfile from './components/CreateProfile';
import UpdateProfile from './components/UpdateProfile';
import SocialLogin from './components/SocialLogin';

//check for token
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and expiratiion
  const decoded = jwt_decode(localStorage.jwtToken);

  // console.log(decoded);

  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    //log out user
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}

if (localStorage.socialUser) {
  setAuthToken(localStorage.accessToken);

  //get social login details from local storage
  const socialUser = JSON.parse(localStorage.getItem('socialUser'));
  store.dispatch(setCurrentUser(socialUser));

  //check fro expired time
  const currentTime = Date.now() / 1000;
  if (socialUser.exp < currentTime) {
    //log out user
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}

function App() {
  return (
    <div className='App'>
      <Router>
        <Route path='/login' component={Login} exact />
        <Route path='/personal-info' component={PersonalInfo} exact />
        <Route path='/create-profile' component={CreateProfile} exact />
        <Route path='/update-profile' component={UpdateProfile} exact />
        <Route path='/social-login' component={SocialLogin} exact />
        <Route path='/' component={Register} exact />
      </Router>
    </div>
  );
}

export default App;
