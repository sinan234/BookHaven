import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.css']
})
export class AdminuserComponent implements OnInit {
  constructor(
    private http:HttpClient,
    private router:Router,
    private spinner:NgxSpinnerService
  ){}
  users:any[]=[]
  chartOptions:any
  search:string=''
  ngOnInit(): void {
    this.spinner.show()

    this.getUsers()
  }
  getUsers(){
    this.http.get('http://localhost:3000/admin/getdata')
    .subscribe({
      next:(res:any)=>{
        this.users=res.user
        console.log('users', this.users)
        this.spinner.hide()
      }
    })
  }
  delete(id:any){

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
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          localStorage.removeItem('admintoken')
        });
      }
    });
  }

}
