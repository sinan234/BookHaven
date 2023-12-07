import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminloginComponent } from "./components/adminlogin/adminlogin.component";
import { AdminhomeComponent } from "./components/adminhome/adminhome.component";
import { AdminuserComponent } from "./components/adminuser/adminuser.component";

const routes:Routes=[
    {path:'admin/login', component:AdminloginComponent},
    {path:'admin/login/home', component:AdminhomeComponent},
    {path:'admin/login/users', component:AdminuserComponent}
]
@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AdminRouting{

}