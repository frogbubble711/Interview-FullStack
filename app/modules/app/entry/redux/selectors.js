import { createSelector } from 'reselect';

const selectEntry = (state) => state.get('app').get('entry');

const makeSelectEntryList = () => createSelector(
  selectEntry,
  (entryState) => entryState.getIn(['entries', 'list']),
);

const makeSelectEntryListLoading = () => createSelector(
  selectEntry,
  (entryState) => entryState.getIn(['entries', 'loading']),
);

export {
  selectEntry,
  makeSelectEntryList,
  makeSelectEntryListLoading,
};
