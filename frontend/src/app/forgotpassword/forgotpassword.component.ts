import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  email!:string
  constructor(
    private http:HttpClient,
    private toastr:ToastrService
  ){}
  send(){
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
          title: 'The email containing instructions for password recovery has been successfully sent to your email address. ',
          text:'Please follow the instructions provided in the email to recover your password.',
          icon: 'success',
          timer: 1000,
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
              SwalModal.style.width = '320px'; 
              SwalModal.style.height = '180px'; 
            }
          },
        });
      }, error:(err)=>{
        this.toastr.error(err.error.message)
      }
     })
  }
}
