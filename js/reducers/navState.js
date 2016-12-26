/**
 * @flow
 */
import { PUSH_ROUTE, POP_ROUTE, SELECT_TAB } from '../actions/navigation.js';
import { NavigationExperimental } from 'react-native';
const { NavigationStateUtils } = NavigationExperimental;

const initialState: State = {
  global: {
    index: 0,
    routes: [{key: 'Welcome', global: true}]
  },

  tabs: {
    index:0,
    routes: [
      {key: 'profile'},
      {key: 'search'},
      {key: 'activity'},
      {key: 'notification'},
      {key: 'connect'}
    ]
  },

  activity: {
    index: 0,
    routes: [{key: 'activity home', global: false}]
  },
  search: {
    index: 0,
    routes: [{key: 'search home', global: false}]
  },
  profile: {
    index: 0,
    routes: [{key: 'profile home', global: false}]
  },
  notification: {
    index: 0,
    routes: [{key: 'notification home', global: false}]
  },
  connect: {
    index: 0,
    routes: [{key: 'connect home', global: false}]
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
        const nextScenes = NavigationStateUtils.push(scenes, route);
        if (scenes !== nextScenes) {
          return {
            ...state,
            global: nextScenes
          };
        }
        break;
      } else {
        const {tabs} = state;
        const tabKey = tabs[tabs.index].key;
        const scenes = state[tabKey];
        const nextScenes = NavigationStateUtils.push(scenes, route);
        if (scenes !== nextScenes) {
          return {
            ...state,
            [tabKey]: nextScenes
          };
        }
      }
    }

    case POP_ROUTE: {
      let {route} = action;
      if (route.global) {
        const scenes = state.global;
        const nextScenes = NavigationStateUtils.pop(scenes);
        if (scenes !== nextScenes) {
          return {
            ...state,
            global: nextScenes
          };
        }
      } else {
        const {tabs} = state;
        const tabKey = tabs[tabs.index].key;
        const scenes = state[tabKey];
        const nextScenes = NavigationStateUtils.pop(scenes);
        if (scenes !== nextScenes) {
          return {
            ...state,
            [tabKey]: nextScenes
          };
        }
      }
    }

    case SWITCH_TAB: {
      const {tabKey} = action;
      const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey);
      if (tabs !== state.tabs) {
        return {
          ...state,
          tabs,
        };
      }
    }
  }

  return state;
};
