import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admincategory',
  templateUrl: './admincategory.component.html',
  styleUrls: ['./admincategory.component.css']
})
export class AdmincategoryComponent implements OnInit{
  category!:string
  cat:any[]=[]
  newcategory:any[]=[]
  show:boolean=false
  showtable:boolean=false
  newcategory1!:string
  id!:string
  ca!:string
  constructor(
    private router:Router,
    private http:HttpClient,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService
  ){}
  
  ngOnInit(): void {
    this.spinner.show()
    this.getData()
  }
  getData(){

    this.http.get('http://localhost:3000/admin/getcategory')
    .subscribe({
      next:(res:any)=>{
        this.spinner.hide()
         this.cat=res;
         this.cat.forEach((item:any)=>{
          if(!this.newcategory.includes(item.category)){
            this.newcategory.push(item.category)

          }
         })
         console.log("categories", this.cat)
         
      },
      error:(err:any)=>{
        console.log("error ocuured", err)
      }
    })
  }
  edit(id:any, cat:string){
    this.showtable=!this.showtable
    this.id=id
    this.newcategory1=cat
  }

  save(){
    const data={
     id:this.id,
     category:this.newcategory1
    }
    this.http.put('http://localhost:3000/admin/updatecategory', data)
    .subscribe({
      next:(res:any)=>{
          this.toastr.success("Category updated successfully")
          this.getData()
          this.showtable=!this.showtable
      },

      error:(err:any)=>{
        this.toastr.error(err.error.message)

      }
    })
  }
  add(){
    const data={
      category:this.category
    }
    this.http.post('http://localhost:3000/admin/addcategory', data)
    .subscribe({
      next:(res:any)=>{
          this.toastr.success("Category added successfully")
          this.category=this.category.slice(0,0)
          this.getData()
      },

      error:(err:any)=>{
        this.toastr.error(err.error.message)

      }
    })
  }

  delete(id:any){
    this.http.delete(`http://localhost:3000/admin/removecategory/${id}`)
    .subscribe({
      next:(res:any)=>{
          this.toastr.success("Category deleted successfully")
          this.getData()
      },

      error:(err:any)=>{
        this.toastr.error(err.error.message)

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
