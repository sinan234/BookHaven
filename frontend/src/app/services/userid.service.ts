import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UseridService {

  constructor() { }
  userid:any
  setuserid(id:string){
    this.userid=id;
  }
  getuserid(){
    return this.userid;
  }
}
