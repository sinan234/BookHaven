import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bookstatus',
  templateUrl: './bookstatus.component.html',
  styleUrls: ['./bookstatus.component.css']
})
export class BookstatusComponent implements OnInit{
constructor(
  private http:HttpClient,
  private toastr:ToastrService
){}

posts:any[]=[];
requests:any[]=[]
req:any[]=[]
reqCount:any[] = []
i:number=0
received:any[]=[]

// public a = -1
ngOnInit(): void {
  this.getData()

}

// Initialize the variable
availableCount: number = 0;

getData(){
  this.http.get('http://localhost:3000/user/bookstatus')
  .subscribe({
    next:(res:any)=>{
      console.log(res)
      this.posts=res.post
      this.requests=res.request
      console.log("posts" , this.posts)
      console.log("requests" , this.requests)
      
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
      
      console.log("req", this.req)
      // console.log("reqCount", this.reqCount)
    },error:(err:any)=>{
      this.toastr.error(err.error.message)
    }
  })
}
}
