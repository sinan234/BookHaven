import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'src/app/services/login.service';
import { UsernameService } from 'src/app/services/username.service';
import Swal from 'sweetalert2'
import * as SearchActions from '../../store-ngrx/search.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(
      public loginService:LoginService,
      private router:Router,
      private store:Store, 
      public user:UsernameService){}

  name=localStorage.getItem('name')?.split(' ')[0]
  searchText:string=''

   show:any;
  ngOnInit(): void {

     this.show=this.loginService.getStatus();
     console.log("show", this.show)
  }
  onSearchTextChange() {
    this.store.dispatch(SearchActions.updateSearchText({ searchText: this.searchText }));
  }
  logout(){
    Swal.fire({
      title: '<span style="font-size: 19px">Are you sure you want to Logout?</span>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
       customClass: {
        title: 'my-custom-title-class'
      }
    
    }).then((result:any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged out Successfully',
          text: 'Please login to continue',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('name')
          this.router.navigate(['login']);
        });
      }
    });
  }
}