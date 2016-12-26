import WelcomeView from '../login/WelcomeView.js';
import SignUpView from '../login/SignUpView.js';
import SignInView from '../login/SignInView.js';
import { SetupProfileView, SetupStatsView, SetupActiveLevelView, SetupLocationView  } from '../login/SetupView.js';
import HomeView from '../HomeView.js';
import ProfileView from '../profile/ProfileView.js';

const ROUTES = {
  WelcomeView: WelcomeView,
  SignInView: SignInView,
  SignUpView: SignUpView,
  SetupProfileView: SetupProfileView,
  SetupStatsView: SetupStatsView,
  SetupActiveLevelView: SetupActiveLevelView,
  SetupLocationView: SetupLocationView,
  HomeView: HomeView,
};

export default ROUTES;
