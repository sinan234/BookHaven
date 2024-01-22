import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatlengthService {

  constructor() { }
  
  length!:number;
  lengthn:any[]=[]

  setLength(length:number){
    this.length=length
  }

  make(length:any,id:any){
    this.lengthn.push({
      id:id,
      length:length
    })
  }
  getLength(){
    return this.lengthn
  }

  clear(){
    this.lengthn.splice(0, this.lengthn.length)
  }
}
