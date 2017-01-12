import WelcomeView from '../login/WelcomeView.js';
import SignUpView from '../login/SignUpView.js';
import SignInView from '../login/SignInView.js';
import { SetupProfileView, SetupStatsView, SetupActiveLevelView, SetupLocationView  } from '../login/SetupView.js';
import OnBoardingSlides from '../login/OnBoardingSlides.js';
import TabNavigator from './TabNavigator.js';
import SettingsMenu from '../settings/SettingsMenu.js';
import MakePost from '../common/post/MakePost.js';
import ComposePost from '../common/post/ComposePost.js';

const ROUTES = {
  WelcomeView: WelcomeView,
  SignInView: SignInView,
  SignUpView: SignUpView,
  SetupProfileView: SetupProfileView,
  SetupStatsView: SetupStatsView,
  SetupActiveLevelView: SetupActiveLevelView,
  SetupLocationView: SetupLocationView,
  TabNavigator: TabNavigator,
  SettingsMenu: SettingsMenu,
  MakePost: MakePost,
  ComposePost: ComposePost,
  OnBoardingSlides: OnBoardingSlides,
};

export default ROUTES;
