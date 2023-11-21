import { Component, DoCheck, OnInit } from '@angular/core';
import { ChatService } from '../services/chatservice.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit,DoCheck {
  newMessage: any;
  messageList: any[] = [];
  recieveList: any[] = [];
  user:any
  a:any[]=[]
  allusers:any
  recid:any
  new:any
  msg:any
  seluser:any
  sender_id:any;
  receiver_id:any
  userId:any
  nr:any
  day:any
  time:any
  constructor(private chatService: ChatService, private http:HttpClient,    private route: ActivatedRoute    ){

  }
  ngOnInit(): void {
    this.recid=this.route.snapshot.paramMap.get('userid')
    console.log('rec id', this.recid)
    
    
    this.http.get('http://localhost:3000/user/getchating')
    .subscribe({
      next:(res:any)=>{
         this.user=res.user
         this.userId=this.user._id
         console.log("userid",this.userId)
         this.allusers=res.alluser
         this.seluser=this.allusers.filter((item:any)=>{
          return item._id===this.recid
         })
         console.log("selected user", this.seluser)
         this.a.push(this.user)
         this.new = this.allusers.filter((item: any) => {
          return !this.a.some((newitem: any) => newitem._id === item._id);
        });
        
         console.log(this.user)
      },
      error:(err:any)=>{
        console.log("error occured", err)
      }
    })
   
    this.chatService.getNewMessage().subscribe((message: any) => {
      this.receiver_id=message.receigverid
      this.sender_id=message.senderid
      console.log("sender id", this.sender_id)
      console.log("receiver id", this.receiver_id)
      if(this.userId==message.receigverid )
      {
        console.log("message",message.message)
        this.messageList.push(message.message);
        console.log("messagelist", this.messageList)
      }
      else{
        this.recieveList.push(message.message);
        console.log("recievelist", this.recieveList)
      }

    })
   
  }
  
  ngDoCheck(): void {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.toLocaleString('en-US', { weekday: 'long' });
    
    const time = hours >= 12 ? (hours - 12) + ' PM' : hours + ' AM';
    this.time = time + ' ' + day.toUpperCase();
    this.recid=this.route.snapshot.paramMap.get('userid')
    this.seluser=this.allusers.filter((item:any)=>{
      return item._id===this.recid
     })
  }
  sendMessage() {
    const data={
      message:this.newMessage,
      senderid:this.userId,
      receigverid:this.recid
    }
    this.chatService.sendMessage(data);
    this.newMessage = '';
  }
}
