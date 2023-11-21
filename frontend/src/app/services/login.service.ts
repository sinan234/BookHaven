import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService  {
  isloggedin:boolean=false
  constructor() { }

   logout(){
    localStorage.removeItem('token')
   }
   getToken(){
    return localStorage.getItem('token')
   }
   getStatus(){
    return !!localStorage.getItem('token')
   }
}
