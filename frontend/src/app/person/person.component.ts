import { Component, DoCheck, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../services/chatservice.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../store-ngrx/message.state';
import { addMessage } from '../store-ngrx/message.actions';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectMessages } from '../store-ngrx/message.selector';
import { loadMessages } from '../store-ngrx/message.actions';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { UseridService } from '../services/userid.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit,DoCheck,OnDestroy, OnChanges {
  newMessage: any;
 isEmojiPickerVisible: boolean=false;
  messageList: any[] = [];
  messageListnew: any[] = [];
  newList: any[] = [];
  user:any
  stored:any
  a:any[]=[]
  allusers:any
  recid:any
  new:any
  msg:any
  filteredmsg:any
  filteredmsgnew:any
  seluser:any
  sender_id:any;
  receiver_id:any
  userId:any
  messagecontainer:any
  nr:any
  messagesubscribe!:Subscription
  id:any
  day:any
  time:any
  messages:any
  sendmessagesubscribe!:Subscription
  messages$=this.store.pipe(select(selectMessages));
  private unsubscribe$ = new Subject<void>();
  private isSubscribed: boolean = false;

  constructor(private chatService: ChatService,
       private http:HttpClient,  
      private route: ActivatedRoute, 
      private store:Store,
      private toastr:ToastrService,
      private userid:UseridService,
      private spinner:NgxSpinnerService
          ){
       
  }
  


  
  ngOnInit(): void {
    this.updatechat()
    this.recid=this.route.snapshot.paramMap.get('userid')
  console.log('rec id', this.recid)
  this.getChat()
  this.spinner.show()
  this.http.get('http://localhost:3000/user/getchating')
  .subscribe({
    next:(res:any)=>{
       this.user=res.user
       this.userId=this.user._id
       console.log("userid",this.userId)
       this.allusers=res.alluser
       this.seluser=this.allusers?.filter((item:any)=>{
        return item._id===this.recid
       })
       console.log("selected user", this.seluser)
       this.a.push(this.user)
       this.new = this.allusers?.filter((item: any) => {
        return !this.a.some((newitem: any) => newitem._id === item._id);
      });
      
       console.log(this.user)
       this.spinner.hide()

    },
    error:(err:any)=>{
      console.log("error occured", err)
    }
  })
  
  this.messagesubscribe=this.chatService.getNewMessage().subscribe((message: any) => {
    this.receiver_id=message.receigverid
    this.sender_id=message.senderid
    console.log("sender id", this.sender_id)
    console.log("receiver id", this.receiver_id)
    this.messageList=this.messageList.filter((item:any)=>{
        return item!=''
      })
    this.messageList.push(message)
    const uniqueMessages = Array.from(new Set(this.messageList));
    this.messageList = uniqueMessages;
    // this.messages=this.messageList.reduce((acc:any,item:any)=>{
    //   if(!acc.includes(item)){
    //     acc.push(item)
    //   }
    //   return acc
    //  })
    //  console.log("messages", this.messages)
    localStorage.setItem('messageList', JSON.stringify(this.messageList));
    console.log("messagelist", this.messageList)

  })


}

ngOnChanges(): void {
  const uniqueMessages = Array.from(new Set(this.messageList));
  this.messageList = uniqueMessages;
}

  ngDoCheck(): void {
    const uniqueMessages = Array.from(new Set(this.messageList));
    this.messageList = uniqueMessages;
    //   this.messages=this.messageList.reduce((acc:any,item:any)=>{
    //   if(!acc.includes(item)){
    //     acc.push(item)
    //   }
    //   return acc
    //  })
    // this.updatechat()

    // const storedMessageList = localStorage.getItem('messageList');
    // if (storedMessageList) {
    //   this.messageList = JSON.parse(storedMessageList);
    // }  
    this.messagecontainer = document.getElementById("messageContainer");
    this.scrollToBottom();
    this.recid=this.route.snapshot.paramMap.get('userid')
    this.userid.setuserid(this.recid);
    this.seluser=this.allusers?.filter((item:any)=>{
      return item._id===this.recid
     })
  }


  scrollToBottom() {
    this.messagecontainer.scrollTop = this.messagecontainer.scrollHeight;
  }
  

 
    public addEmoji(event: any) {
      const emoji = event.emoji.native || '';
      this.newMessage = (this.newMessage || '').replace('undefined', '') + emoji;
      this.isEmojiPickerVisible = false;
    }
  updatechat(){
     this.stored = localStorage.getItem('messageList');
    if ( this.stored) {
      this.messageList = JSON.parse(this.stored); 
     
    }  
  }

  deletechat(recieverid:string){
    console.log("receiver id", recieverid)
    Swal.fire({
      title: '<span style="font-size: 17px">Are you sure you want to clear chat?</span>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      didOpen: () => {
        const SwalModal = Swal.getPopup();
        if (SwalModal) {
          SwalModal.style.width = '340px'; 
          SwalModal.style.height = '160px'; 
          SwalModal.style.marginLeft='260px';

        }
      },
       customClass: {
        title: 'my-custom-title-class'
      }
    
    }).then((result:any) => {
      if (result.isConfirmed) {
         const message=localStorage.getItem('messageList')
         console.log("messagelist before", this.messageList)
         if(message){
             this.filteredmsg=JSON.parse(message)
             this.filteredmsgnew=this.filteredmsg?.filter((item:any)=>{
                  return item.receigverid==recieverid || item.senderid==recieverid
             })
             console.log("filtered message", this.filteredmsgnew)
             this.messageListnew = this.messageList.filter((item: any) => {
              return !this.filteredmsgnew.some((newItem: any) => {
                return (item.senderid === newItem.senderid && item.receigverid=== newItem.receigverid);
              });
            });
            console.log("messagelistnew", this.messageListnew)
            localStorage.removeItem('messageList')
            this.toastr.success("Chat cleared successfully")
            this.messageListnew=this.messageListnew.filter((item:any)=>{
              return item!=''
            })
            this.messageList=this.messageListnew
            localStorage.setItem('messageList', JSON.stringify(this.messageList));
            this.updatechat()
            
         }

         }})
      
    
  }
  getChat(){
  
    this.store.dispatch(loadMessages());    
  //   this.http.get("http://localhost:3000/user/getchat")
  //   .subscribe({
  //     next:(response:any)=>{
  //       console.log("chat" , response.chat)
          // for( let i of response.chat){
          //   this.messageList.push(i)
          // }

  //       console.log("new list", this.newList)
  //     },error:(err:any)=>{
  //       console.log("error occured", err.error.message)
  //     }
  //   })
  }

  updateTimeAndUserData(): string {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.toLocaleString('en-US', { weekday: 'long' });
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const time = hours >= 12 ? (hours - 12) + ':' + formattedMinutes + ' PM' : hours + ':' + formattedMinutes + ' AM';
    this.time = time + ' ' + day.toUpperCase();
    return this.time
  }
  sendMessage() {
    const data={
      message:this.newMessage,
      senderid:this.userId,
      receigverid:this.recid,
      time:this.updateTimeAndUserData()
    }
    // this.http.post('http://localhost:3000/user/addchat' , data)
    // .subscribe({
    //   next:(response:any)=>{
    //     console.log(response.message)
    //   },
    //   error:(err:any)=>{
    //     console.log("error",err.error.message)
    //   }
    // })
    // this.getChat()
    this.sendmessagesubscribe=this.chatService.sendMessage(data).subscribe();
    this.newMessage = '';
  }

  ngOnDestroy(): void {

     this.messagesubscribe.unsubscribe()
     this.sendmessagesubscribe.unsubscribe()
    
   }
}
