import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {selectSearchText} from '../../store-ngrx/search.selectors'

@Component({
  selector: 'app-bookstatus',
  templateUrl: './bookstatus.component.html',
  styleUrls: ['./bookstatus.component.css']
})
export class BookstatusComponent implements OnInit{
constructor(
  private http:HttpClient,
  private toastr:ToastrService,
  private spinner:NgxSpinnerService,
  private store:Store
){}

posts:any[]=[];
requests:any[]=[]
req:any[]=[]
reqCount:any[] = []
i:number=0
show:boolean=false
received:any[]=[]
showNotFoundImage: boolean = false; 
searchText!: string;
searchText$: Observable<string>=new Observable<string>;

ngOnInit(): void {
  this.showNotFoundImage=false
  this.spinner.show()
  this.searchText$ = this.store.select(selectSearchText);
  this.searchText$.subscribe(text => {
    this.searchText = text;
    this.updateNotFoundFlag();
  });
  this.getData()

}
updateNotFoundFlag() {
  this.showNotFoundImage = this.req.length > 0 && this.req.every(item =>
    !item.bookname.toLowerCase().includes(this.searchText.toLowerCase()) &&
    !item.author.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
getData(){
  
  this.http.get('http://localhost:3000/user/bookstatus')
  .subscribe({
    next:(res:any)=>{
      console.log(res)
      this.posts=res.post
      this.requests=res.request
      console.log("posts" , this.posts)
      console.log("requests" , this.requests)
      if(this.requests.length<=0){
        this.show=true
      }
      this.posts.forEach((item: any) => {
        if (item.status != 'Available') {
          const receiver = this.requests.filter((newItem: any) => {
            return (item.bookname === newItem.bookname) && (newItem.status=='Accepted');
          });
          this.req.push({
            bookname: item.bookname,
            status: item.status,
            author: item.author,
            category: item.bookcategory,
            image: item.image,
            receiver: receiver[0].sendername
          });
        } else {
          this.req.push({
            bookname: item.bookname,
            status: item.status,
            author: item.author,
            category: item.bookcategory,
            image: item.image,
            receiver: 'None'
          });
        }
      });
      this.spinner.hide()
      console.log("req", this.req)
      // console.log("reqCount", this.reqCount)
    },error:(err:any)=>{
      this.toastr.error(err.error.message)
    }
  })
}
}
