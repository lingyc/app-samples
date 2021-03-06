import Profile from '../tabs/profile/Profile.js';
import Activity from '../tabs/activity/Activity.js';
import Search from '../tabs/search/Search.js';
import Notification from '../tabs/notification/Notification.js';
import Connect from '../tabs/connect/Connect.js';

import ProfileEntry from '../common/ProfileEntry.js';
import PostView from '../common/post/PostView.js';
import ImageView from '../common/ImageView.js';
import PostImagesView from '../common/PostImagesView.js';

const ROUTES = {
  Profile: Profile,
  Activity: Activity,
  Search: Search,
  Notification: Notification,
  Connect: Connect,
  ProfileEntry: ProfileEntry,
  PostView: PostView,
  ImageView: ImageView,
  PostImagesView: PostImagesView
};

export default ROUTES;
