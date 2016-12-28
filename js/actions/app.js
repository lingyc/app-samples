/**
 * @flow
 */

export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const PRINT_ERROR = 'PRINT_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const setLoadingState = (state: boolean) => {
  return {
    type: SET_LOADING_STATE,
    payload: state
  }
};

export const printError = (error: string) => {
  return {
    type: PRINT_ERROR,
    payload: error
  }
};

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
};
