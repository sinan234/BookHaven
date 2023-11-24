export interface MessageState {
    messages: Message[];
  }
  
  export interface Message {
    senderId: string;
    receiverId: string;
    time: string;
    message: string;
  }