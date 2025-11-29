import {createSelector} from '@ngrx/store';
import {profileFeature} from './reducer';

export const selectFilteredProfiles =  createSelector(
  profileFeature.selectProfiles,
  // profileFeature.selectProfileFilters,
  (profiles) => profiles,
)
