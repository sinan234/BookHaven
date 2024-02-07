import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
show:boolean=false
@ViewChild('aboutSection') aboutSection!: ElementRef;
@ViewChild('categorySection') categorySection!: ElementRef;
@ViewChild('contactSection') contactSection!:ElementRef;
  content:any;
  name:string='';
  email:string='';
  phone:string='';
  message:string=''
  constructor(private route: ActivatedRoute,
    private toastr:ToastrService,
    private http:HttpClient) { }
  ngOnInit() {

          this.route.fragment.subscribe(fragment => {
            if (fragment === 'about') {
              this.scrollToAboutSection();
            } else if (fragment === 'category') {
              this.scrollToCategorySection();
            } else if (fragment === 'contact') {
              this.scrollToContactSection();
            }
          });
        
      }
  
  submit(form: NgForm){
     if(this.name.length<=0 || this.email.length<=0 ||this.phone.length<=0 ||this.message.length<=0  ){
      this.toastr.error("Fields cannot be empty")
      return
     }
     const data= {
      name:form.value.name,
      email:form.value.email,
      phone:form.value.phone,
      message:form.value.message

     }
     this.http.post('http://localhost:3000/user/sendinquiry', data)
     .subscribe({
      next:(res:any)=>{
        Swal.fire({
          position: 'top-end',
          title: 'Inquiry sended successfully ',
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
        form.reset()
      }, error:(err:any)=>{
        this.toastr.error(err.error.message)
      }
     })
  }
  scrollToAboutSection() {
    if (this.aboutSection) {
      this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToCategorySection() {
    if (this.categorySection) {
      this.categorySection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToContactSection() {
    if (this.contactSection) {
      this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  togglecarousel1(){
    this.show=false  
  }

   togglecarousel2() {
     this.show=true
   }


}
