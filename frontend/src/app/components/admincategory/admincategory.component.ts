import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admincategory',
  templateUrl: './admincategory.component.html',
  styleUrls: ['./admincategory.component.css']
})
export class AdmincategoryComponent {
  constructor(
    private router:Router
  ){}
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
