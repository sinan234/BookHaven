import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UsernameService } from '../../services/username.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   constructor(
     private toastr:ToastrService,
     private http:HttpClient,
     private service:UsernameService, 
     private router:Router
   ){}
   email:string=''
   password:string=''

   sessiontime(cookie: any) {
    const sessionend = cookie.sessionEnd;
    const currentTime = new Date().getTime();
    const remainingTime = sessionend - currentTime;
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
       this.toastr.warning('Session ended, Please login to continue');
      this.router.navigate(['login']);
    }, remainingTime);
  }
   onsubmit(form:NgForm){
    console.log("submit button clicked")
    if(this.email.length==0 || this.password.length<6){
        this.toastr.error("Inavlid email or password format")
        return
    }
    const data={
      email:form.value.email,
      password:form.value.password
    }
    this.http.post("http://localhost:3000/user/login" , data)
    .subscribe(
      {
        next:(res:any)=>{ 
          console.log(res)
          if(res.message=='Authentication Successful'){
            localStorage.setItem('token',res.cookie.token)
            localStorage.setItem('name', res.name)
            this.sessiontime(res.cookie)
            this.service.setName(res.name)
          Swal.fire({
            title: 'Login Succesful',
            text: 'Welcome'+ ' '+this.service.getName(),
            icon: 'success',
            timer: 800, 
            showConfirmButton: false 
          });
          setTimeout(()=>{
            this.router.navigate(['login', 'feed'])

          },700)
          // console.log("token", res.cookie.token)
        }else{
          Swal.fire({
            title: res.message,
            icon: 'error',
            timer: 3000, 
            showConfirmButton: false 
          });
        }
        },
        error:(err:any)=>{
          Swal.fire({
            title: 'Error occured',
            text: err.error.message,
            icon: 'error',
            timer: 3000, 
            showConfirmButton: false 
          });
        }
      }
    )
   }
}
