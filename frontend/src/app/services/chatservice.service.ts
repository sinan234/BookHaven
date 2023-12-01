import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: Subject<string> = new Subject();
  constructor() {}

  socket = io('http://localhost:3200');

  public sendMessage(message: any): Observable<any> {
    return new Observable(
      
      (observable)=> {
       this.socket.emit('message', message);
    })
    console.log('sendMessage: ', message)
  
    
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      console.log("GetNewMessage",message)
      this.message$.next(message);
    });
  
  
    return this.message$.asObservable();
  };

  public getchat(sender:any,receiver:any){
      this.socket.emit("existChat",{
        snederid:sender,
        receiverid:receiver
      })
  }

  public Loadchat = () => {
    this.socket.on('currentchat', (message) =>{
      this.message$.next(message);
    });
  
  
    return this.message$.asObservable();
  };
}