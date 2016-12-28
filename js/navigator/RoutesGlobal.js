import WelcomeView from '../login/WelcomeView.js';
import SignUpView from '../login/SignUpView.js';
import SignInView from '../login/SignInView.js';
import { SetupProfileView, SetupStatsView, SetupActiveLevelView, SetupLocationView  } from '../login/SetupView.js';
import FitlyHomeView from '../FitlyHomeView.js';
import SettingsMenu from '../settings/SettingsMenu.js';

const ROUTES = {
  WelcomeView: WelcomeView,
  SignInView: SignInView,
  SignUpView: SignUpView,
  SetupProfileView: SetupProfileView,
  SetupStatsView: SetupStatsView,
  SetupActiveLevelView: SetupActiveLevelView,
  SetupLocationView: SetupLocationView,
  FitlyHomeView: FitlyHomeView,
  SettingsMenu: SettingsMenu,
};

export default ROUTES;
