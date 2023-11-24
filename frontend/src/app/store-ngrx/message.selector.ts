import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState, Message } from './message.state';

export const selectMessageState = createFeatureSelector<MessageState>('messages');

export const selectMessages = createSelector(
  selectMessageState,
  (state: MessageState) => state.messages
);