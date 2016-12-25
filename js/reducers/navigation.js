/**
 * @flow
 */
import { SWITCH_TAB } from '../actions/navigation.js';

type TabType =
    'profile'
  | 'search'
  | 'activities'
  | 'notifications'
  | 'connect'
  ;

type StateType = {
  tab: TabType
};

const initialState: State = {
  tab: 'profile'
};

export default function (state: State = initialState, action): State {
  switch (action.type) {
    case SWITCH_TAB:
      return { ...state,
        tab: action.payload,
      };
    default:
    return state;
  }
};
