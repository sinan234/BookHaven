import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppState } from '../../store-ngrx/search.reduce';
import { Store ,select} from '@ngrx/store';
import {selectSearchText} from '../../store-ngrx/search.selectors'
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, DoCheck {
  user: any;
  posts: any;
  postsn:any[]=[]
  times: any;
  searchText$: Observable<string>=new Observable<string>;
  details: string = '';
  bookdetails: string = '';
  image: string = '';
  bookname: string = '';
  author: string = '';
  newimg: any;
  m:any
  wish:any;
  wishlistColor: any;
  img:string=''
  val:any
  show: boolean = false;
  showPreloader:boolean=true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private store:Store
  ) {
   
  }
  ngOnInit(): void {
    this.searchText$ = this.store.select(selectSearchText);
    
    this.getData();
    
    const duration = 800;
    setTimeout(() => {
      this.showPreloader = false;
    }, duration);
  }

  ngDoCheck(): void {

    if (this.details.length > 30) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  getData(){
    this.http.get('http://localhost:3000/user/getpost').subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.posts = res.posts;
        this.postsn=this.posts
        console.log("posts",this.postsn)
        
        this.wish=res.wish
        console.log("wish", this.wish)
        this.m=this.wish.reduce((unique:any,item:any)=>{
           if(!unique.includes(item.productId)){
            unique.push(item.productId)
           }
           return unique
        },[])
        console.log("wishnew",this.m)        
      },
      error: (err: any) => {
        console.log('error occured', err);
      },
    });
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
  

  like(id:any){
    const data={
      postId:id
    }
    this.http.put('http://localhost:3000/user/updatelike', data)
    .subscribe({
      next:(res:any)=>{
        console.log(res)
        if(res.message=='Post liked successfully')
        {
        this.toastr.success("Post liked ")
        }
        else{
          this.toastr.warning("Post disliked ")

        }
        this.getData()
      },
      error:(err:any)=>{
        this.toastr.error(err.error.message)
        console.log("error occured", err)
      }
    })
  }

  wishlist(id:any){
    const data={
      postId:id
    }
    this.http.post('http://localhost:3000/user/create_wishlist', data)
    .subscribe({
      next:(res:any)=>{
        Swal.fire({
          position: 'top-end',
          title: 'Post wishlisted successfully',
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
        this.getData()
      },
      error:(err:any)=>{
        this.toastr.error(err.error.message)
        console.log("error occured", err)
      }
    })
  }
  onsubmit() {
    if (this.details.length < 30) {
      this.toastr.warning('Please add more description about the book');
      return;
    }
    this.newimg = this.image.split('\\').pop();
    if (!this.newimg) {
      this.toastr.error('Please select an image');
      return;
    }
    if (
      this.bookname.length < 0 ||
      this.author.length < 0 ||
      this.bookdetails.length < 0
    ) {
      this.toastr.error('Fields cannot be empty');
      return;
    }
    const date = new Date();
    const time = date.getTime();
    const data = {
      bookname: this.bookname,
      author: this.author,
      image: this.newimg,
      postdetails: this.details,
      bookdetails: this.bookdetails,
      time: time,
    };
    console.log(data);
    this.http.post('http://localhost:3000/user/create_post', data).subscribe({
      next: (res: any) => {
        if (res) {
          Swal.fire({
            position: 'top-end',
            title: 'Post saved successfully',
            icon: 'success',
            timer: 1300,
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
          this.details = '';
          this.bookdetails = '';
          this.image = '';
          this.author = '';
          this.bookname = '';
          this.getData();
        }
      },
      error: (err: any) => {
        Swal.fire({
          position: 'top-end',
          title: err.error.message,
          icon: 'error',
          timer: 1300,
          showConfirmButton: false,
          didOpen: () => {
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
      },
    });
  }
}
