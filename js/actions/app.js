/**
 * @flow
 */

export const SET_LOADING_STATE = 'SET_LOADING_STATE';

export const setLoadingState = (state: boolean) => {
  return {
    type: SET_LOADING_STATE,
    payload: state
  }
}
