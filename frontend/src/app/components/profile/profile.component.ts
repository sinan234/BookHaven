import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any
  showPreloader:boolean=true;

  constructor(
    private http:HttpClient,
    private spinner:NgxSpinnerService
  ){}
   ngOnInit(): void {
    // const duration = 600;
    // setTimeout(() => {
    //   this.showPreloader = false;
    // }, duration);
    this.spinner.show()
      this.http.get('http://localhost:3000/user/getprofile')
      .subscribe({
        next:(res:any)=>{
           this.user=res.user
           this.spinner.hide()
           console.log(this.user)
        },
        error:(err:any)=>{
          console.log("error occured", err)
        }
      })
   }
}
