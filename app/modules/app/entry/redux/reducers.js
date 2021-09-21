import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const initalState = fromJS({
  entries: {
    list: [],
    loading: false,
  },
});

function entryReducer(state = initalState, action) {
  switch (action.type) {
    case CONSTANTS.ENTRY_LIST_REQUEST:
      return state.setIn(['entries', 'loading'], true);
    case CONSTANTS.ENTRY_LIST_SUCCESS:
      return state.setIn(['entries', 'list'], fromJS(action.data))
        .setIn(['entries', 'loading'], false);
    case CONSTANTS.ENTRY_LIST_ERROR:
      return state.setIn(['entries', 'loading'], false);
    default:
  }

  return state;
}

export default entryReducer;
