import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router,NavigationStart  } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatlengthService } from 'src/app/services/chatlength.service';
import { UseridService } from 'src/app/services/userid.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, DoCheck{
  newMessage: any;
  messageList: string[] = [];
  user:any
  search:string=''
  showPreloader:boolean=true
  a:any[]=[]
  userId:any
  allusers:any
  new:any
  id:any
  show:boolean=false
  chat:boolean=false
  hoveredItemId!: string; 
  chatid:any
  cu:any

  constructor( private http:HttpClient,private router:Router,private spinner:NgxSpinnerService, private route:ActivatedRoute, private userid:UseridService , public chaty:ChatlengthService ){

  }

  ngOnInit(){
    
    // const duration = 720;
    // setTimeout(() => {
    //   this.showPreloader = false;
    // }, duration);
    this.spinner.show()
    this.http.get('http://localhost:3000/user/getchating')
    .subscribe({
      next:(res:any)=>{
        this.spinner.hide()
         this.user=res.user
         this.allusers=res.alluser
         console.log("user", this.user)
         console.log("alluser", this.allusers)
         this.a.push(this.user)
         console.log("a", this.a)
         this.new = this.allusers.filter((item: any) => {
          return !this.a.some((newitem: any) => newitem._id === item._id);
        });
        console.log("new", this.new)
      },
      error:(err:any)=>{
        console.log("error occured", err)
      }
    })
   
  }
  ngDoCheck(): void {
    this.id=this.userid.getuserid()
    const currentPath = window.location.pathname;
    if(currentPath=='/login/chat'){
         this.show=true
    }
    else{
      this.show=false
      this.chat=true
    }
  }
  onMouseEnter(itemId: string) {
    this.hoveredItemId = itemId;
  }

  onMouseLeave() {
    this.hoveredItemId = '';
  }
}
