import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as Highcharts from 'highcharts';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})

export class AdminhomeComponent implements OnInit{
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: any;
  chartOptions2: any;

 search!:string
 user!:string
 post:any
 wishlist:any[]=[]
books:any[]=[]
like:any[]=[]
wish:any[]=[]
b:any[]=[]

updatedPostArray:any[]=[]
 constructor(
  private router:Router,
  private http:HttpClient,
  private spinner:NgxSpinnerService
 ){}
 
 ngOnInit(): void {
  
   this.getData()

   this.chartOptions = {
    chart: {
      type: 'line',
  
    }, 
    title: {
      text: 'Top Liked and Wishlisted Books',
      style: {
        color: '#00308F'
      }
    },
    xAxis: {
      categories: this.books,
     
      title: {
        text: 'Books',
        style: {
          fontSize:'24px' ,  
          position:'relative',        
          marginTop:'20px',
          color:'#00308F',
          fontWeight:'bold'
           }
      },
      labels: {
        style: {
          color: '#00308F',
          lineColor: '#00308F',
          minorGridLineColor: '#00308F',
          fontSize:'19px'     ,
          tickColor: '#707073',
      

        },
      },
      gridLineColor: ['green', 'blue', 'yellow', 'orange']
    },
    yAxis: {
      title: {
        text: 'Number ',
        style: {
          color: '#00308F',
          fontSize:'20px',
          fontWeight:'bold'          

        }
      },
      labels: {
        style: {
          color: '#00308F',
          fontSize:'19px'           


        }
      },  lineColor: '#707073',
           minorGridLineColor: '#505053',
           tickColor: '#707073',
           tickWidth: 1,
    },
    series: [{
      name: 'Wishlists',
      data: this.wish,
      color: '#0039a6'
    },{
      name: 'Likes',
      data: this.like,
      color: '#ff0000' 
    }],
         tooltip: {
       backgroundColor: 'rgba(0, 0, 0, 0.85)',
       style: {
         color: 'black',
         fontSize:'18px'           

       }
     },
    plotOptions: {
      series: {
        dataLabels: {
          color: 'black',
          fontSize:'24px'           

        }
      }
    }  

  };
  
  

  
 }

 getData(){
  this.spinner.show();
  this.http.get('http://localhost:3000/admin/getdata')
  .subscribe({
    next:(res:any)=>{
      console.log(res)
      this.user=res.user
      this.post=res.post
      this.spinner.hide()

      this.post.slice(0, 5).forEach((item: any) => {
        this.books.push(item.bookname);
      });
      
this.post.slice(0,5).forEach((item: any) => {
  this.like.push(item.like);
});
    
      this.wishlist=res.wishlist
      console.log("wishlist",this.wishlist)
      const reducedData = this.wishlist.reduce((acc, obj) => {
        const productId = obj.productId;
        if (acc[productId]) {
          acc[productId]++;
        } else {
          acc[productId] = 1;
        }
        return acc;
      }, {});
      
      const result = Object.entries(reducedData).map(([productId, count]) => ({ productId, count }));
      
      console.log("result",result);
      this.updatedPostArray = this.post.map((post:any) => {
        const resultObj = result.find(result => result.productId === post._id);
        const count = resultObj ? resultObj.count : 0;
        return { ...post, count };
      });
      
      console.log("updated", this.updatedPostArray);
      this.updatedPostArray.slice(0,5).forEach((item:any)=>{
          this.wish.push(item.count)
      })

    },
    error:(err:any)=>{
      console.log("error occured", err)
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
