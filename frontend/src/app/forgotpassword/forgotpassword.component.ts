import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  email:string=''
  constructor(
    private http:HttpClient,
    private toastr:ToastrService,
    private router:Router
  ){}
  go(){
    console.log("clicked")
    this.router.navigate(['login'])
  }
  send(){
    console.log("clicked")
    if(this.email.length<=0){
      this.toastr.error("Email field cannot be empty")
      return
     }
     const data={
      email:this.email
     }
     this.http.post('http://localhost:3000/user/forgotpassword' , data)
     .subscribe({
      next:(res)=>{
       
        Swal.fire({
          position: 'top-end',
          title: '<span style="font-size: 19px">The email containing instructions for password recovery has been successfully sent to your email address. </span>',
          text:'Please follow the instructions provided in the email to recover your password.',
          icon: 'success',
          timer: 4000,
          showConfirmButton: false,
          didOpen: () => {
            const SwalIcon = Swal.getIcon();
            if (SwalIcon) {
             
              SwalIcon.style.width = '100px'; 
              SwalIcon.style.height = '100px'; 
            }
            const SwalTitle = Swal.getTitle();
            if (SwalTitle) {
      SwalTitle.style.fontSize = '20px'; 
    }
            const SwalModal = Swal.getPopup();
            if (SwalModal) {
              SwalModal.style.width = '520px'; 
              SwalModal.style.height = '380px'; 
            }
          },
        });
        this.email=''
      }, error:(err)=>{
        this.toastr.error(err.error.message)
      }
     })
  }
}
