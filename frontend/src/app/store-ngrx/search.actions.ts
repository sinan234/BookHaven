import { createAction, props } from '@ngrx/store';

export const updateSearchText = createAction(
  '[Header] Update Search Text',
  props<{ searchText: string }>()
);