import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { error } from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {
  pass1!:string;
  pass2!:string;
  constructor(
    private toastr:ToastrService,
    private http:HttpClient
  ){}
  save(){
    if(this.pass1.length<6 || this.pass2.length<6){
      this.toastr.warning("Passwords must be atleast 8 characters")
      return
    }
    else if(this.pass1!=this.pass2){
      this.toastr.warning("Passwords must be same")
      return
    }
    const currentpath=window.location.pathname.split('/')[2]
    console.log(currentpath)
    const data={
      userId: currentpath,
      password:this.pass1

    }
    this.http.post('http://localhost:3000/user/resetpassword', data)
    .subscribe({
      next:(res)=>{
        Swal.fire({
          position: 'top-end',
          title: 'Password resetted successfully ',
          text:'You can now login to the website and enjoy reading',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          didOpen: () => {
            const SwalIcon = Swal.getIcon();
            if (SwalIcon) {
             
              SwalIcon.style.width = '80px'; 
              SwalIcon.style.height = '80px'; 
            }
            const SwalTitle = Swal.getTitle();
            if (SwalTitle) {
      SwalTitle.style.fontSize = '20px'; 
    }
            const SwalModal = Swal.getPopup();
            if (SwalModal) {
              SwalModal.style.width = '360px'; 
              SwalModal.style.height = '200px'; 
            }
          },
        });
        this.pass1=''
        this.pass2=''

      },error:(err)=>{
        this.toastr.error(err.error.message)
      }
  })
}
}
