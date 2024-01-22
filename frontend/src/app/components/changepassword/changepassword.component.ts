import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit{
user:any
oldpass!:string
newpass1!:string
newpass2!:string

constructor(
  private http:HttpClient,
  private toastr:ToastrService,
  private router:Router,
  private spinner:NgxSpinnerService
){}

ngOnInit(): void {
    this.getData()
 }

 getData(){
  this.spinner.show()
  this.http.get('http://localhost:3000/user/getprofile')
    .subscribe({
      next:(res:any)=>{
         this.user=res.user
         this.spinner.hide()

      },
      error:(err:any)=>{
        console.log("error occured", err)
      }
    })
 }
submit(form:NgForm){
  console.log("submit")
  if(form.value.oldpass.length<8 || form.value.newpass1.length<8){
    this.toastr.error('Password must contain atleast 8 characters')
    return
  }
  else if(form.value.newpass1!=form.value.newpass2){
    this.toastr.error('Passwords must be same')
    return

  }
  else if(form.value.oldpass===form.value.newpass1){
    this.toastr.error('Passwords cannot be same')
    return
  }
  const data={
    oldpass:this.oldpass,
    newpass:this.newpass1,

  }
  this.http.put('http://localhost:3000/user/profile/changepassword', data)
  .subscribe({
    next:(res:any)=>{
      this.toastr.success("Password changed successfully")
      form.reset()
    },
    error:(err:any)=>{
      this.toastr.error(err.error.message)
    }
  })
}
}
