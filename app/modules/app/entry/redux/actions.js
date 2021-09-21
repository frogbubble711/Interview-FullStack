import * as CONSTANTS from './constants';

export function entryListRequest() {
  return {
    type: CONSTANTS.ENTRY_LIST_REQUEST,
  };
}

export function entryListSuccess(data) {
  return {
    type: CONSTANTS.ENTRY_LIST_SUCCESS,
    data,
  };
}

export function entryListError(data) {
  return {
    type: CONSTANTS.ENTRY_LIST_ERROR,
    data,
  };
}
