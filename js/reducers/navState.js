/**
 * @flow
 */
import { PUSH_ROUTE, POP_ROUTE, SELECT_TAB, RESET_TO, MOVE_BACK, MOVE_FORWARD, CLEAR_LOCAL_NAV_STATE } from '../actions/navigation.js';
import { NavigationExperimental } from 'react-native';
const { StateUtils } = NavigationExperimental;

const initialState: State = {
  global: {
    index: 0,
    routes: [{key: 'WelcomeView', global: true}]
  },

  tabs: {
    index: 2,
    routes: [
      {key: 'Activity'},
      {key: 'Search'},
      {key: 'Profile'},
      {key: 'Notification'},
      {key: 'Connect'}
    ]
  },

  Activity: {
    index: 0,
    routes: [{key: 'Activity', global: false}]
  },
  Search: {
    index: 0,
    routes: [{key: 'Search', global: false}]
  },
  Profile: {
    index: 0,
    routes: [{key: 'Profile', global: false}]
  },
  Notification: {
    index: 0,
    routes: [{key: 'Notification', global: false}]
  },
  Connect: {
    index: 0,
    routes: [{key: 'Connect', global: false}]
  },
};

//sample action
// action: {
//   type: PUSH_ROUTE,
//   route: {
//     view: 'SignUpView',
//     global: true
//   }
// }

export default function (state: State = initialState, action): State {
  let {type} = action;
  switch (type) {

    case PUSH_ROUTE: {
      let {route} = action;
      if (route.global) {
        const scenes = state.global;
        const nextScenes = StateUtils.push(scenes, route);
        if (scenes !== nextScenes) {
          return {
            ...state,
            global: nextScenes
          };
        }
      } else {
        const {tabs} = state;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = state[tabKey];
        const nextScenes = StateUtils.push(scenes, route);
        if (scenes !== nextScenes) {
          return {
            ...state,
            [tabKey]: nextScenes
          };
        }
      }
      break;
    }

    case POP_ROUTE: {
      let {route} = action;
      if (!route || route.global) {
        const scenes = state.global;
        const nextScenes = StateUtils.pop(scenes);
        if (scenes !== nextScenes) {
          return {
            ...state,
            global: nextScenes
          };
        }
      } else {
        const {tabs} = state;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = state[tabKey];
        const nextScenes = StateUtils.pop(scenes);
        if (scenes !== nextScenes) {
          return {
            ...state,
            [tabKey]: nextScenes
          };
        }
      }
      break;
    }

    case SELECT_TAB: {
      const {tabIndex} = action;
      if (tabIndex !== state.tabs.index) {
        const tabs = {...state.tabs, index: tabIndex};
        return {
          ...state,
          tabs
        };
      }
      break;
    }

    case RESET_TO: {
      let {route} = action;
      if (route.global) {
        const scenes = state.global;
        const nextScenes = StateUtils.reset(scenes, [route], 0);
        if (scenes !== nextScenes) {
          return {
            ...state,
            global: nextScenes
          };
        }
      } else {
        const {tabs} = state;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = state[tabKey];
        const nextScenes = StateUtils.reset(scenes, [route], 0);
        if (scenes !== nextScenes) {
          return {
            ...state,
            [tabKey]: nextScenes
          };
        }
      }
      break;
    }

    case CLEAR_LOCAL_NAV_STATE: {
      return initialState;
    }
  }

  return state;
};
