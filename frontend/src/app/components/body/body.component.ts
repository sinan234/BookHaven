import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  constructor(private route: ActivatedRoute) { }
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
