import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
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
  private router:Router,
  private renderer:Renderer2
  ) {
    this.showPassword = false;
    this.eyeIconClass = 'bi bi-eye';
    this.showPassword2 = false;
    this.eyeIconClass2 = 'bi bi-eye';
  }
  @ViewChild('otp1Input') otp1Input!: ElementRef;
  @ViewChild('otp2Input') otp2Input!: ElementRef;
  @ViewChild('otp3Input') otp3Input!: ElementRef;
  @ViewChild('otp4Input') otp4Input!: ElementRef;
  @ViewChild('otp5Input') otp5Input!: ElementRef;
  @ViewChild('otp6Input') otp6Input!: ElementRef;

  name:string=''
  email: string = '';
  password: string = '';
  otp:boolean=false
  cpassword: string = '';
  cat1: string = 'Choose your interested category1';
  cat2: string = 'Choose your interested category2';
  cat3: string = 'Choose your interested category 3';
  phone: string = '';
  location: string = '';
  image:string='';
  Razorpay:any;
  paymentid:string=''
  show: boolean = false;
  showotp:boolean=false
  otp1!:number
  otp2!:number
  otp3!:number
  otp4!:number
  otp5!:number
  otp6!:number
  paymentInitialized: boolean = false;
  showPassword!: boolean;
  eyeIconClass!: string;
  showPassword2!: boolean;
  eyeIconClass2!: string;
  passwordError1!: string;
  passwordError2!: string;
  onFileChange(event: any) {

    this.toastr.success('File uploaded successfully', 'Success');
  }
  

    sendOtp() {
      console.log("clicked")
      if(this.email.length<=0){
        this.toastr.error("Please enter a valid email address")
        return
      }
      if(this.password!=this.cpassword){
        this.toastr.error("Passwords donot match")
        return
      }
      if(this.password.length<6){
        this.toastr.error("Passwords must be atleast 6 characters long")
        return
      }
      const expirationTime = 2; 
      Swal.fire({
        position: 'top-end',
        title: 'OTP has been sent to your email',
        text:`It will expire in ${expirationTime} minutes`,
        icon: 'success',
        timer: 3200,
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
            SwalModal.style.width = '390px'; 
            SwalModal.style.height = '270px'; 
          }
        },
      });
      this.showotp=true
 
      this.http.post('http://localhost:3000/user/send-otp', { email: this.email , name:this.name }).subscribe(
        (response) => {
          console.log(response);
       
        },
        (error) => {
          this.toastr.error(error);
        }
      );
   }
   onOtpInput(event: any, nextInput: any) {
    const inputValue = event.target.value;
    const maxLength = event.target.maxLength;
  
    if (inputValue !== '') {
      if (inputValue.length === maxLength) {
        nextInput.focus();
      }
    }
  }
  

  checkPasswordValidity(): void {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (!regex.test(this.password)) {
      this.passwordError1 = 'Password must contain at least 8 characters including at';
      this.passwordError2='least one letter, one number, and one special character.'
    } else {
      this.passwordError1 = '';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.eyeIconClass = this.showPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
  
  }

  togglePasswordVisibilityb() {
    this.showPassword2 = !this.showPassword2;
    this.eyeIconClass2 = this.showPassword2 ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  focusNextInput(nextInput: any) {
    if (nextInput) {
      nextInput.focus();
    }
  }
   confirmOtp(){
      if(!this.otp1 || !this.otp2 || !this.otp3 || !this.otp4 || !this.otp5 || !this.otp6 ){
        this.toastr.warning("OTP Fields cannot be empty")
        return 
      }
      const otp= this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6
      console.log("otp", otp)
      const data={
        otp:otp
      }
      this.http.post('http://localhost:3000/user/verify-otp', data)
      .subscribe({
        next:(response)=>{
          Swal.fire({
            position: 'top-end',
            title: 'OTP verified successfully  ',
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
          this.showotp=!this.showotp
          this.show=!this.show
        }, error:(err)=>{
          Swal.fire({
            position: 'top-end',
            title: 'OTP is Incorrect',
            text:'Please check your email and try again',
            icon: 'error',
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
                SwalModal.style.width = '390px'; 
                SwalModal.style.height = '260px'; 
              }
            },
          }); 
        }
      })
   }
  
   moveToNextField(event:any, nextFieldId:any) {
    const maxLength = event.target.getAttribute('maxlength');
    const currentLength = event.target.value.length;
  
    if (currentLength >= maxLength) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  }
  
  next() {
    console.log('clicked');
    if (this.password != this.cpassword) {
      this.toastr.error('Passwords donot match');
      return;
    } 
    if (this.email == ' ' || this.password == '') {
      this.toastr.error('Username or password cannot be empty');
      return;
    } 
    if (this.password.length < 6) {
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
        this.paymentInitialized = true;
  
        Swal.fire({
          position: 'top-end',
          title: 'Payment Successful',
          text:'Please register to continue',
          icon: 'success',
          timer: 1500,
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
              SwalModal.style.height = '250px'; 
            }
          },
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
    if(form.value.image.length<=0){
      this.toastr.warning("Please select the profile picture")
      return;
    }
    else   if (!this.paymentInitialized) {
      this.toastr.warning("Please make the payment");
      return;
    }
    else if(this.cat1 == this.cat2 || this.cat2 == this.cat3|| this.cat1 == this.cat3  ){
      this.toastr.error("Categories cannot be same")
      return;
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
