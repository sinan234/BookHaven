import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {selectSearchText} from '../store-ngrx/search.selectors'
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  showPreloader:boolean=true;
  products:any;
  searchText$: Observable<string>=new Observable<string>;
  allproducts:any
  filteredposts:any
  display:boolean=false
  val:any
  constructor(private http:HttpClient, 
    private store:Store,
    private toastr:ToastrService
    ){}
  ngOnInit(): void {
    this.searchText$ = this.store.select(selectSearchText);

    const duration = 500;
    setTimeout(() => {
      this.showPreloader = false;
    }, duration);
    this.getProducts()
  }
   
  getProducts(){
    this.http.get('http://localhost:3000/user/getwishlist')
    .subscribe({
       next:(res:any)=>{
        console.log("response from server" , res)
        this.products=res.products
        this.allproducts=res.allproduct
        console.log("products",this.products)
         this.filteredposts = this.allproducts.filter((item: any) => {
          return this.products.some((newitem: any) => {
            return item._id === newitem.productId;
          });
        });
        if(this.filteredposts.length<=0){
          this.display=true
        }
        console.log("all products",this.filteredposts)

       },
       error:(err:any)=>{
        console.log("error occured", err)
       }
    })
  }
  getTime(time: any) {
   
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - time;
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) { 
      return secondsDifference + 's ago';
    } else if (secondsDifference < 3600) {
      return Math.floor(secondsDifference / 60) + ' minutes ago';
    } else if (secondsDifference < 86400) {
      return Math.floor(secondsDifference / 3600) + ' hour ago';
    } else {
      return Math.floor(secondsDifference / 86400) + ' day ago';
    }
  }
  wishlist(id:any){
     console.log(id)
     this.http.delete(`http://localhost:3000/user/removewishlist/${id}`)
     .subscribe({
         next:(res:any)=>{
          Swal.fire({
            position: 'top-end',
            title: 'Post removed from wishlist ',
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
          this.getProducts()
         },
         error:(err:any)=>{
            this.toastr.error(err.error.message)
         }
     })
  }

}
