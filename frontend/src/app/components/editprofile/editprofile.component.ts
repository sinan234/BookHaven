import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
  user:any
  name:string=''
  location:string=''
  cat1:string='';
  cat2:string=''
  cat3:string=''
  phone:string=''
  showPreloader:boolean=true;


  constructor(
    private http:HttpClient,
    private toastr:ToastrService,
    private router:Router
  ){}
   ngOnInit(): void {
    const duration = 300;
    setTimeout(() => {
      this.showPreloader = false;
    }, duration);
      this.getData()
   }

   getData(){
    this.http.get('http://localhost:3000/user/getprofile')
      .subscribe({
        next:(res:any)=>{
           this.user=res.user
           console.log("user",this.user)
           this.name=this.user.name;
           this.location=this.user.location;
           this.phone=this.user.phone;
           this.cat1=this.user.category1;
           this.cat2=this.user.category2;
           this.cat3=this.user.category3;


        },
        error:(err:any)=>{
          console.log("error occured", err)
        }
      })
   }
   

   

   onsubmit(){
    const data={
      name:this.name,
      cat1:this.cat1,
      cat2:this.cat2,
      cat3:this.cat3,
      location:this.location,
      phone:this.phone
    }
    this.http.put('http://localhost:3000/user/profile/update', data)
    .subscribe({
      next:(res:any)=>{
        Swal.fire({
          position: 'top-end',
          title: 'Your profile has been updated',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          didOpen: () => {
            const SwalIcon = Swal.getIcon();
            if (SwalIcon) {
              SwalIcon.style.width = '60px';
              SwalIcon.style.height = '60px';
            }
            const SwalTitle = Swal.getTitle();
            if (SwalTitle) {
              SwalTitle.style.fontSize = '20px';
            }
            const SwalModal = Swal.getPopup();
            if (SwalModal) {
              SwalModal.style.width = '300px';
              SwalModal.style.height = '200px';
            }
          },
        });
        setTimeout(()=>{
          this.router.navigate(['login','profile'])

        },1000)
      },
      error:(err:any)=>{
        console.log("error occured", err)
      }
    })
   }
}
