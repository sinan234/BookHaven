import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { error } from 'highcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  req:any[]=[]
  show:boolean=false
  sender:any[]=[]
  accepted:boolean=false
  filteredUsers:any[]=[]
  constructor(
    private http:HttpClient,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
  ){}

  ngOnInit(): void {
    this.spinner.show()
    this.getRequests()
  }
 
  accept(book:any){
    const date=new Date()
    const time= date.getTime()
    let item = book
    item['accepted_time']=this.calculateRelativeTime(parseInt(book.duration))
    console.log("item", item)
    this.http.post('http://localhost:3000/user/acceptrequest' , item)
    .subscribe({
      next:(res:any)=>{
        Swal.fire({
          position: 'top-end',
          title: 'Request accepted successfully ',
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
        this.getRequests()

    }, error:(err:any)=>{
        this.toastr.error(err.error.message)
    }
    })
  }

ignore(book:any){
 const data=book._id
 this.http.delete(`http://localhost:3000/user/removerequest/${data}` )
 .subscribe({
  next:(response:any)=>{
    Swal.fire({
      position: 'top-end',
      title: 'Request ignored successfully ',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
      didOpen: () => {
        const SwalIcon = Swal.getIcon();
        if (SwalIcon) {
         
          SwalIcon.style.width = '70px'; 
          SwalIcon.style.height = '70px'; 
        }
        const SwalTitle = Swal.getTitle();
        if (SwalTitle) {
  SwalTitle.style.fontSize = '20px'; 
}
        const SwalModal = Swal.getPopup();
        if (SwalModal) {
          SwalModal.style.width = '320px'; 
          SwalModal.style.height = '180px'; 
        }
      },
    });
    this.getRequests()

  },

 }),(error:any)=>{
    console.log(error)
 }
}
  getRequests(){
    this.http.get('http://localhost:3000/user/getRequest')
    .subscribe({
      next:(res:any)=>{
         this.req=res.data;
         console.log(res.user)
         this.filteredUsers = res.user.filter((userItem:any) => {
          return this.req.some((reqItem) => {
            return userItem._id === reqItem.userId;
          });
        });
        
         console.log("filtered user", this.filteredUsers)
         console.log("req", this.req)
         if(this.req.length<=0){
          this.show=true
      }
      this.spinner.hide()
      },error:(err:any)=>{
        console.log(err)
      }
    })
  }
    timeAgo(time:any) {
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
   calculateRelativeTime(duration: number): string {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getTime());
    targetDate.setDate(targetDate.getDate() + (duration * 7));
  
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
  
    if (secondsDifference < 60) {
      return 'Available in less than a minute';
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      return `Available in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (secondsDifference < 86400) {
      const hours = Math.floor(secondsDifference / 3600);
      return `Available in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (secondsDifference < 2592000) {
      const days = Math.floor(secondsDifference / 86400);
      return `Available in ${days} day${days > 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(secondsDifference / 2592000);
      return `Available in ${months} month${months > 1 ? 's' : ''}`;
    }
  }
}
