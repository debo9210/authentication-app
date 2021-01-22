import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authActions';
import store from './store';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import PersonalInfo from './components/Personal-Info';

//check for token
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and expiratiion
  const decoded = jwt_decode(localStorage.jwtToken);

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

function App() {
  return (
    <div className='App'>
      <Router>
        <Route path='/login' component={Login} exact />
        <Route path='/personal-info' component={PersonalInfo} exact />
        <Route path='/' component={Register} exact />
      </Router>
    </div>
  );
}

export default App;
