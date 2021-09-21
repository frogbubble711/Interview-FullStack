import { fork, call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import * as CONSTANTS from './constants';
import {
  entryListSuccess,
  entryListError,
} from './actions';

export function* entryListRequest() {
  try {
    const data = yield call(request, 'entries', 'GET', null, true);
    yield put(entryListSuccess(data));
  } catch (err) {
    yield put(entryListError(err));
  }
}

export default [
  fork(takeLatest, CONSTANTS.ENTRY_LIST_REQUEST, entryListRequest),
];
