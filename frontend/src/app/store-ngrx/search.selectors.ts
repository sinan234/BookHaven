import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './search.reduce';

export const selectSearchState = createFeatureSelector<AppState>('header');

export const selectSearchText = createSelector(
  selectSearchState,
  (state: AppState) => state.searchText
);