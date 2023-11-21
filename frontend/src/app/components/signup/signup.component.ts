import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

declare var Razorpay:any
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
  private toastr: ToastrService,
  private http:HttpClient,
  private router:Router
  ) {}
  name:string=''
  email: string = '';
  password: string = '';
  cpassword: string = '';
  cat1: string = 'Choose your interested category1';
  cat2: string = 'Choose your interested category2';
  cat3: string = 'Choose your interested category 3';
  phone: string = '';
  location: string = '';
  image:string='';
  Razorpay:any;
  paymentid:any
  show: boolean = false;

  next() {
    console.log('clicked');
    if (this.password != this.cpassword) {
      this.toastr.error('Passwords donot match');
      return;
    } else if (this.email == ' ' || this.password == '') {
      this.toastr.error('Username or password cannot be empty');
      return;
    } else if (this.password.length < 6) {
      this.toastr.error('Passwords must contain atleast 6 characters');
      return;
    }
    this.toastr.success('Details Saved');
    this.show = true;
  }
  onpay() {
    console.log("payment clicked");
  
    const Razorpayoptions = {
      description: 'Sample Payment',
      currency: 'INR',
      amount: 2000,
      name: 'test',
      image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
      key: environment.key,
      prefill: {
        name: 'test',
        email: 'test@gmail.com',
        phone: '9998887775',
      },
      theme: {
        color: '#6466e3',
        display: 'block',
      },
      handler: (response: any) => {

        console.log('payment_id', response.razorpay_payment_id);
        this.paymentid = response.razorpay_payment_id;
        Swal.fire({
          position: "top-end",
          title: 'Payment Successful',
          text: 'Please register to continue',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      },
      modal: {
        ondismiss: () => {
          alert('Payment Failed');
        },
      },
    };
  
    const successCallback = (payment_id: any) => {
      console.log('payment_id', payment_id);
    };
  
    const failureCallback = (error: any) => {
      console.log('error', error);
    };
  
    Razorpay.open(Razorpayoptions, successCallback, failureCallback);
  }

   onsubmit(form:NgForm){
    console.log("submit button clicked")
    if(this.cat1 == this.cat2 || this.cat2 == this.cat3|| this.cat1 == this.cat3  ){
      this.toastr.error("Ctegories cannot be same")
      return
    }
    if(this.paymentid.length<=0){
      this.toastr.warning("Please make the payment")
      return
    }
      const data={
        name:this.name,
        email:this.email,
        password:this.password,
        category1:form.value.cat1,
        category2:form.value.cat2,
        category3:form.value.cat3,
        phone:form.value.phone,
        location:form.value.location,
        image:  form.value.image.split("\\").pop(),
        paymentid:this.paymentid
        
      }
      console.log("form data", data)
      this.http.post('http://localhost:3000/user/create_user', data)
      .subscribe(
       {
        next: (response:any)=>{
          console.log(response)
          Swal.fire({
            title: 'User created Successfully',
            text: 'Please login to continue ',
            icon: 'success',
            timer: 3000, 
            showConfirmButton: false 
          });
          this.router.navigate(['login']);
          form.reset()
        },
        error:(error:any)=>{
          console.log("error ocuured during signup" , error)
        }
       }
      )
   }

}
