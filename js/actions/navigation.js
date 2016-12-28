/**
 * @flow
 */

export const PUSH_ROUTE = 'PUSH_ROUTE';
export const POP_ROUTE = 'POP_ROUTE';
export const SELECT_TAB = 'SELECT_TAB';
export const RESET_TO = 'RESET_TO';
export const MOVE_BACK = 'MOVE_BACK';
export const MOVE_FORWARD = 'MOVE_FORWARD';

export const push = (route: object) => {
  return {
    type: PUSH_ROUTE,
    route: route
  }
};

export const pop = (route: object) => {
  return {
    type: POP_ROUTE,
    route: route
  }
};

export const selectTab = (tabIndex: number) => {
  return {
    type: SELECT_TAB,
    tabIndex: tabIndex
  }
};

export const resetTo = (route: object) => {
  return {
    type: RESET_TO,
    route: route
  }
};

export const moveBack = () => {
  return {
    type: MOVE_BACK,
  }
};

export const moveForward = () => {
  return {
    type: MOVE_FORWARD,
  }
};
