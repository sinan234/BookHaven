import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admininquiry',
  templateUrl: './admininquiry.component.html',
  styleUrls: ['./admininquiry.component.css']
})
export class AdmininquiryComponent implements OnInit {
   search:string=''
   inquiries:any[]=[]
  constructor(private router:Router, private http:HttpClient, private toastr:ToastrService){}

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.http.get('http://localhost:3000/user/getinquiry').subscribe({
      next:(res:any)=>{
        this.inquiries=res.data
        console.log("inquiries", this.inquiries)
      }, error:(err:any)=>{
        console.log("error", err.error.message)
      }
    })
  }
  resolve(id:any){
    const data={
      id:id
    }
    this.http.post('http://localhost:3000/user/updateinquiry', data).subscribe({
      next:(res:any)=>{
        this.toastr.success("Inquiry resolved succesfully")
      }, error:(err:any)=>{
        console.log("error", err.error.message)
      }
    })
    
  }
  logout(){
    Swal.fire({
      title: '<span style="font-size: 19px">Are you sure you want to Logout?</span>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['admin','login']);
        Swal.fire({
          title: 'Logged out Successfully',
          text: 'Please login to continue',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          localStorage.removeItem('admintoken')
        });
      }
    });
  }
}
