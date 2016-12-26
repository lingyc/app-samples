/**
 * @flow
 */

export const PUSH_ROUTE = 'PUSH_ROUTE';
export const POP_ROUTE = 'POP_ROUTE';
export const SELECT_TAB = 'SELECT_TAB';

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
