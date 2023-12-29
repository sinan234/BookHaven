import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  constructor() { }
  name:string=''
  image:string=''
  setName(name:string){
    this.name=name
  }
  getName(){
    return this.name
  }


}
