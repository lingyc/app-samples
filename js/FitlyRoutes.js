import Auth from './Auth.js';
import Welcome from './login/Welcome.js';
import SignUp from './login/Signup.js';
import SignIn from './login/Signin.js';
import Profile from './views/Profile.js';


const ROUTES = {
  Auth: Auth,
  Welcome: Welcome,
  SignIn: SignIn,
  SignUp: SignUp,
  Profile: Profile
};

export default ROUTES;
