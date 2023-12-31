import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as Highcharts from 'highcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})

export class AdminhomeComponent implements OnInit{
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: any;
  chartOptions2: any;
  sho:boolean=false
  type!:string
  count:string='Select the count'
 search!:string
 user!:string
 post:any
 wishlist:any[]=[]
books:any[]=[]
like:any[]=[]
wish:any[]=[]
b:any[]=[]
booktable:any[]=[]
liketable:any[]=[]
wishtable:any[]=[]
usertable:any[]=[]
updatedPostArray:any[]=[]
 constructor(
  private router:Router,
  private http:HttpClient,
  private spinner:NgxSpinnerService,
  private toastr:ToastrService
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
      color: 'red' 
    }],
         tooltip: {
       backgroundColor: '#f1f2f3',
       style: {
         color: '#00308F',
         fontSize:'18px'           

       }
     },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#00308F',
          fontSize:'24px'           

        }
      }
    }  

  };
  
  

  
 }

 download() {
  const doc = new jsPDF();

  const tableData = [];
  let sortedIndices = [];
  if (this.type === 'Like') {
    sortedIndices = this.sortIndicesDescending(this.liketable);
  } else if (this.type === 'Wishlist') {
    sortedIndices = this.sortIndicesDescending(this.wishtable);
  } else if (this.type === 'All') {
    sortedIndices = this.sortIndicesAlphabetical(this.booktable);
  } else {
    sortedIndices = Array.from({ length: this.booktable.length }, (_, i) => i);
  }

  for (const index of sortedIndices) {
    const bookName = this.booktable[index];
    const postedBy = this.usertable[index];
    let rowData = [bookName, postedBy];

    if (this.type === 'Like') {
      const likes = this.liketable[index];
      rowData.push(likes);
    } else if (this.type === 'Wishlist') {
      const wishlistCount = this.wishtable[index];
      rowData.push(wishlistCount);
    } else if (this.type === 'All') {
      const likes = this.liketable[index];
      const wishlistCount = this.wishtable[index];
      rowData.push(likes, wishlistCount);
    }

    tableData.push(rowData);
  }

  let columns: any[] = [];
  if (this.type === 'Like') {
    columns = ['Book Name', 'Posted By', 'Likes Count'];
  } else if (this.type === 'Wishlist') {
    columns = ['Book Name', 'Posted By', 'Wishlist Count'];
  } else if (this.type === 'All') {
    columns = ['Book Name', 'Posted By', 'Likes Count', 'Wishlist Count'];
  }


  autoTable(doc, {
    head: [columns],
    body: tableData,
  });


  doc.save('book_data.pdf');
  this.type=''
  this.count='Select the count'
  this.sho=!this.sho
}
sortIndicesDescending(arr:any) {
  return arr
    .map((_:any, index:any) => index)
    .sort((a:any, b:any) => arr[b] - arr[a]);
}

 sortIndicesAlphabetical(arr:any) {
  return arr
    .map((_:any, index:any) => index)
    .sort((a:any, b:any) => arr[a].localeCompare(arr[b]));
}
 getData(){
  this.spinner.show();
  this.http.get('http://localhost:3000/admin/getdata')
  .subscribe({
    next:(res:any)=>{
      console.log(res)
      this.spinner.hide()

      this.user=res.user
      this.post=res.post

      this.post.slice(0, 5).forEach((item: any) => {
        this.books.push(item.bookname);
      });
      
      this.post.slice(0,5).forEach((item: any) => {
  this.like.push(item.like);
});
      this.post.forEach((item: any) => {
  this.booktable.push(item.bookname);
  this.liketable.push(item.like)
  this.usertable.push(item.username)
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
      this.updatedPostArray.forEach((item:any)=>{
        this.wishtable.push(item.count)
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
