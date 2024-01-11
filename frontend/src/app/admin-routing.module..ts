import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminloginComponent } from "./components/adminlogin/adminlogin.component";
import { AdminhomeComponent } from "./components/adminhome/adminhome.component";
import { AdminuserComponent } from "./components/adminuser/adminuser.component";
import { AdminAuthGuard } from "./services/adminauthguard.guard";
import { ErrorComponent } from "./components/error/error.component";
import { AdmininquiryComponent } from "./components/admininquiry/admininquiry.component";


const routes: Routes = [
  { path: 'admin/login/home', component: AdminhomeComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/login/users', component: AdminuserComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/login', component: AdminloginComponent },
  {path:'admin/login/inquiry' , component:AdmininquiryComponent}
];
@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ],
  providers:[
    AdminAuthGuard
  ]
})
export class AdminRouting{

}