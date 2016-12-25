/**
 * @flow
 */

export const SWITCH_TAB = 'SWITCH_TAB';

export const switchTab = (tab: string) => {
  return {
    type: SWITCH_TAB,
    payload: tab
  }
};
