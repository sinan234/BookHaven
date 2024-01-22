import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {selectSearchText} from '../store-ngrx/search.selectors'
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

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
  showNotFoundImage: boolean = false; 
searchText!: string;
userid!:string

  constructor(private http:HttpClient, 
    private store:Store,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService
    ){}
  ngOnInit(): void {
    this.searchText$ = this.store.select(selectSearchText);

    const duration = 600;
    // setTimeout(() => {
    //   this.showPreloader = false;
    // }, duration);
    this.spinner.show()
    this.getProducts()
    this.searchText$.subscribe(text => {
      this.searchText = text;
      this.updateNotFoundFlag();
    });
  }
   
  getProducts(){
    this.http.get('http://localhost:3000/user/getwishlist')
    .subscribe({
       next:(res:any)=>{
        this.spinner.hide()
        console.log("response from server" , res)
        this.products=res.products
        this.allproducts=res.allproduct
        this.userid=res.userid.toString()
        console.log("userid", this.userid)
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
  updateNotFoundFlag() {
    this.showNotFoundImage = this.filteredposts.length > 0 && this.filteredposts.every((item:any) =>
      !item.bookname.toLowerCase().includes(this.searchText.toLowerCase()) &&
      !item.author.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
          this.toastr.success("Post removed from wishlist")
      //     Swal.fire({
      //       position: 'top-end',
      //       title: 'Post removed from wishlist ',
      //       icon: 'success',
      //       timer: 1000,
      //       showConfirmButton: false,
      //       didOpen: () => {
      //         const SwalIcon = Swal.getIcon();
      //         if (SwalIcon) {
               
      //           SwalIcon.style.width = '60px'; 
      //           SwalIcon.style.height = '60px'; 
      //         }
      //         const SwalTitle = Swal.getTitle();
      //         if (SwalTitle) {
      //   SwalTitle.style.fontSize = '20px'; 
      // }
      //         const SwalModal = Swal.getPopup();
      //         if (SwalModal) {
      //           SwalModal.style.width = '260px'; 
      //           SwalModal.style.height = '190px'; 
      //         }
      //       },
      //     });
          this.getProducts()
         },
         error:(err:any)=>{
            this.toastr.error(err.error.message)
         }
     })
  }

  like(id: any) {
    console.log("clicked")
    const data = {
      postId: id,
    };
    this.http.put('http://localhost:3000/user/updatelike', data).subscribe({
      next: (res: any) => {
        console.log(res)

        this.getProducts()
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
        console.log('error occured', err);
      },
    });
  }

}
