import WelcomeView from '../login/WelcomeView.js';
import SignUpView from '../login/SignUpView.js';
import SignInView from '../login/SignInView.js';
import { SetupProfileView, SetupStatsView, SetupActiveLevelView, SetupLocationView  } from '../login/SetupView.js';
import OnBoardingSlides from '../login/OnBoardingSlides.js';
import TabNavigator from './TabNavigator.js';
import SettingsMenu from '../settings/SettingsMenu.js';
import MakePost from '../common/post/MakePost.js';
import ComposePost from '../common/post/ComposePost.js';
import CreateActivityScene from '../common/activity/CreateActivityScene.js';
import SelectDateScene from '../common/activity/SelectDateScene.js';
import SelectLocationScene from '../common/activity/SelectLocationScene.js';

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
  CreateActivityScene: CreateActivityScene,
  SelectDateScene: SelectDateScene,
  SelectLocationScene: SelectLocationScene
};

export default ROUTES;
