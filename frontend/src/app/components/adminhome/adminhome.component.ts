import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})

export class AdminhomeComponent implements OnInit{
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: any;
 search!:string
 user!:string
 post:any
 wishlist:any[]=[]
books:any[]=[]
wish:any[]=[]
updatedPostArray:any[]=[]
 constructor(
  private router:Router,
  private http:HttpClient
 ){}
 
 ngOnInit(): void {
   this.getData()
   
   const colors: string[] = ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee'];
  
   Highcharts.setOptions({
     chart: {
       style: {
         plotBorderColor: '#ffffff'
       },
       backgroundColor: 'blue'
     },
     title: {
       style: {
         color: 'white'
       }
     },
     xAxis: {
       labels: {
         style: {
           color: 'white'
         }
       },
       lineColor: '#707073',
       minorGridLineColor: '#505053',
       tickColor: '#707073',
       title: {
         style: {
           color: 'white'
         }
       }
     },
     yAxis: {
       labels: {
         style: {
           color: 'white'
         }
       },
       lineColor: '#707073',
       minorGridLineColor: '#505053',
       tickColor: '#707073',
       tickWidth: 1,
       title: {
         style: {
           color: 'white'
         }
       }
     },
     tooltip: {
       backgroundColor: 'rgba(0, 0, 0, 0.85)',
       style: {
         color: '#F0F0F0'
       }
     },
     plotOptions: {
       series: {
         dataLabels: {
           color: 'white'
         }
       }
     },
     colors: colors
   });

   this.chartOptions = {
    chart: {
      type: 'line',
      style: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    title: {
      text: 'Most Wishlisted Books',
      style: {
        color: 'white'
      }
    },
    xAxis: {
      categories: this.books,
      title: {
        text: 'Books',
        style: {
          fontSize:'20px' ,  
          positin:'relative',        
          marginTop:'20px'
           }
      },
      labels: {
        style: {
          color: 'white',
          fontSize:'17px'           

        }
      }
    },
    yAxis: {
      title: {
        text: 'Number of Wishlists',
        style: {
          color: 'white',
          fontSize:'17px'           

        }
      },
      labels: {
        style: {
          color: 'white',
          fontSize:'17px'           


        }
      }
    },
    series: [{
      name: 'Wishlists',
      data: this.wish,
      color: 'blue'
    }],
    plotOptions: {
      series: {
        dataLabels: {
          color: 'white',
          fontSize:'20px'           

        }
      }
    }
  };
  


  
 }

getData(){
  this.http.get('http://localhost:3000/admin/getdata')
  .subscribe({
    next:(res:any)=>{
      console.log(res)
      this.user=res.user
      this.post=res.post
      

this.post.forEach((item: any) => {
  this.books.push(item.bookname);
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
      this.updatedPostArray.forEach((item:any)=>{
          this.wish.push(item.count)
      })
      console.log("wish", this.wish)
    },
    error:(err:any)=>{
      console.log("error occured", err)
    }
  })
}
  logout(){
    Swal.fire({
      title: 'Are you sure you want to Logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged out Successfully',
          text: 'Please login to continue',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          localStorage.removeItem('admintoken')
          this.router.navigate(['admin','login']);
        });
      }
    });
  }
}
