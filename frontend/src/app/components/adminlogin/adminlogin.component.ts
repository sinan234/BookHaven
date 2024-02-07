import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  constructor(
    private toastr:ToastrService,
    private http:HttpClient,
    private router:Router,
    private route:ActivatedRoute
  ){
    this.showPassword = false;
    this.eyeIconClass = 'bi bi-eye-slash';
  }

  email!:string
  password!:string
  showPassword!: boolean;
  eyeIconClass!: string;


  onsubmit(form:NgForm){
      if(form.value.email.length<=0 || form.value.password.length<=0){
          this.toastr.error("Fields cannot be empty")
          return
      }
      const data={
        email:form.value.email,
        password:form.value.password
      }
      this.http.post("http://localhost:3000/admin/login" ,data)
      .subscribe({
        
        next:(res:any)=>{
          Swal.fire({
            title: 'Login Succesful',
            text: 'Welcome'+ ' '+'Admin',
            icon: 'success',
            timer: 700, 
            showConfirmButton: false ,
            customClass: {
              popup: 'custom-swal-popup'
            }
          });
          localStorage.setItem('admintoken', res.token)
          setTimeout(()=>{
            this.router.navigate(['home'],{
              relativeTo:this.route
            })
          },700)
      
  
        
  
        const currentTime = new Date().getTime();
        const remainingTime = res.time - currentTime;
        setTimeout(() => {
          localStorage.removeItem('admintoken')
          this.toastr.warning('Session ended, Please login to continue')
          this.router.navigate(['admin','login']);
        },remainingTime);
         form.reset()
        }
        ,error:(err:any)=>{
          this.toastr.error(err.error.message)
        }
      })
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.eyeIconClass = this.showPassword ? 'bi bi-eye' : 'bi bi-eye-slash';
  }
}
