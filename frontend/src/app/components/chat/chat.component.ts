import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  newMessage: any;
  messageList: string[] = [];
  user:any
  a:any[]=[]
  userId:any
  allusers:any
  new:any
  constructor( private http:HttpClient, private route:ActivatedRoute){

  }

  ngOnInit(){
    
    this.http.get('http://localhost:3000/user/getchating')
    .subscribe({
      next:(res:any)=>{
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

}
