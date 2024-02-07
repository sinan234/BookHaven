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
import { ChatlengthService } from '../services/chatlength.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit,DoCheck,OnDestroy, OnChanges {
  newMessage: any;
  customOption!:string
 isEmojiPickerVisible: boolean=false;
  messageList: any[] = [];
  messageListnew: any[] = [];
  newList: any[] = [];
  user:any
  menu:boolean=false
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
  messages:any;
  selvalue!:string
  dis:string=' '
  sendmessagesubscribe!:Subscription
  messages$=this.store.pipe(select(selectMessages));
  chat:any
  private unsubscribe$ = new Subject<void>();
  private isSubscribed: boolean = false;

  constructor(private chatService: ChatService,
       private http:HttpClient,  
      private route: ActivatedRoute, 
      private store:Store,
      private toastr:ToastrService,
      private userid:UseridService,
      private spinner:NgxSpinnerService,
      private chatlength:ChatlengthService
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
       this.chat=res.chat
       console.log("chat",this.chat)
       console.log("message list", this.messageList)
       this.chat.forEach((item: any) => {
        const exists = this.messageList.some((newitem: any) => {
          return item.senderid === newitem.senderid && item.receigverid === newitem.receigverid && item.time === newitem.time && item.message===newitem.message;
        });
        console.log("exists", exists)
      
        if (!exists) {
          this.messageList.push({
            message: item.message,
            senderid: item.senderid,
            receigverid: item.receigverid,
            time: item.time
          });
          // this.chatlength.make(item.senderid, 1)
        }
      });
      // console.log("chatlength",this.chatlength.getLength())

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
    this.messagecontainer = document.getElementById("messageContainer");
    this.scrollToBottom();
    this.recid=this.route.snapshot.paramMap.get('userid')
    this.userid.setuserid(this.recid);
    this.seluser=this.allusers?.filter((item:any)=>{
      return item._id===this.recid
     })
  }



  updateReason() {
    this.selvalue = this.customOption;
  }
  send(id:any, sender:any){
    if(this.selvalue.length<=0){
      this.toastr.error("You must provide an valid reason to report the user")
      return
    }
    const data={
      userId:id,
      senderId:sender,
      reason:this.selvalue
    }
    console.log(data)
    this.http.post("http://localhost:3000/user/createwarning", data)
    .subscribe({
      next: (res: any) => {
        Swal.fire({
          position: 'top-end',
          title: 'Report sent successfully',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          didOpen: () => {
            const SwalIcon = Swal.getIcon();
            if (SwalIcon) {
              SwalIcon.style.width = '70px';
              SwalIcon.style.height = '70px';
            }
            const SwalTitle = Swal.getTitle();
            if (SwalTitle) {
              SwalTitle.style.fontSize = '20px';
            }
            const SwalModal = Swal.getPopup();
            if (SwalModal) {
              SwalModal.style.width = '320px';
              SwalModal.style.height = '180px';
            }
          },
        });
        this.menu = !this.menu;
        this.selvalue = '';
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
        this.menu = !this.menu;
        this.selvalue = '';
      }
    });
  }  

  menus():boolean{
    console.log("clicked")
    this.menu=!this.menu;
    return this.menu
  }

  select(event:any){
    this.selvalue=event.target.value
    console.log(this.selvalue)
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
         this.http.delete(`http://localhost:3000/user/chat/delete/${recieverid}`)
         .subscribe({
          next:(res:any)=>{
            console.log("response from server", res)
          }
          ,error:(err:any)=>{
            console.log("error from server", err)
          }
         })

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
    this.http.post('http://localhost:3000/user/addchat' , data)
    .subscribe({
      next:(response:any)=>{
        console.log(response.message)
      },
      error:(err:any)=>{
        console.log("error",err.error.message)
      }
    })
    // this.getChat()
    this.sendmessagesubscribe=this.chatService.sendMessage(data).subscribe();
    this.newMessage = '';
    
  }

  ngOnDestroy(): void {

     this.messagesubscribe.unsubscribe()
     this.sendmessagesubscribe.unsubscribe()
    
   }
}
