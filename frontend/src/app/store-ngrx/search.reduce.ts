import { createReducer, on } from '@ngrx/store';
import * as SearchActions from './search.actions';

export interface AppState {
  searchText: string;
}

export const initialState: AppState = {
  searchText: '',
};

export const headerReducer = createReducer(
  initialState,
  on(SearchActions.updateSearchText, (state, { searchText }) => ({
    ...state,
    searchText,
  }))
);
