import { createReducer, on } from '@ngrx/store';
import { addMessage } from './message.actions';


export interface MessageState {
    messages: Message[];
  }
  
  export interface Message {
    senderId: string;
    receiverId: string;
    time: string;
    message: string;
  }

export const initialState:MessageState={
    messages:[]
}

export const messageReducer = createReducer(
    initialState,
    on(addMessage, (state, { message }) => ({
      ...state,
      messages: [...state.messages, message],
    }))
  );
