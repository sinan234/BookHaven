import { createAction, props } from '@ngrx/store';
import { Message } from './message.state';

export const addMessage = createAction(
  '[Message] Add Message',
  props<{ message: Message }>()
);

export const loadMessages = createAction('[Message] Load Messages');