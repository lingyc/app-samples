/**
 * @flow
 */

export const PUSH_ROUTE = 'PUSH_ROUTE';
export const POP_ROUTE = 'POP_ROUTE';
export const SELECT_TAB = 'SELECT_TAB';
export const RESET_TO = 'RESET_TO';

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

export const selectTab = (tabKey: string) => {
  return {
    type: SELECT_TAB,
    tabKey: tabKey
  }
};

export const resetTo = (route: object) => {
  return {
    type: RESET_TO,
    route: route
  }
};
