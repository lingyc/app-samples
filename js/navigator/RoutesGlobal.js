import WelcomeView from '../login/WelcomeView.js';
import SignUpView from '../login/SignUpView.js';
import SignInView from '../login/SignInView.js';
import { SetupProfileView, SetupStatsView, SetupActiveLevelView, SetupLocationView  } from '../login/SetupView.js';
import FitlyHomeView from '../FitlyHomeView.js';
import SettingsMenu from '../settings/SettingsMenu.js';
import MakePost from '../common/post/MakePost.js';
import ComposePost from '../common/post/ComposePost.js';
import ComposeReply from '../common/ComposeReply.js';

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
  MakePost: MakePost,
  ComposePost: ComposePost,
  ComposeReply: ComposeReply,
};

export default ROUTES;
