import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any
  showPreloader:boolean=true;

  constructor(
    private http:HttpClient
  ){}
   ngOnInit(): void {
    const duration = 600;
    setTimeout(() => {
      this.showPreloader = false;
    }, duration);
      this.http.get('http://localhost:3000/user/getprofile')
      .subscribe({
        next:(res:any)=>{
           this.user=res.user
           console.log(this.user)
        },
        error:(err:any)=>{
          console.log("error occured", err)
        }
      })
   }
}
