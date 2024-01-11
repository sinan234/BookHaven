import { NgModule } from "@angular/core";
import { AdminloginComponent } from "./components/adminlogin/adminlogin.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { AdminRouting } from "./admin-routing.module.";
import { AdminhomeComponent } from "./components/adminhome/adminhome.component";
import { HighchartsChartModule } from 'highcharts-angular';
import { AdminuserComponent } from "./components/adminuser/adminuser.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { AdmininquiryComponent } from "./components/admininquiry/admininquiry.component";

@NgModule({
    declarations:[
        AdminloginComponent,
        AdminhomeComponent,
        AdminuserComponent,
        AdmininquiryComponent
    ],
    imports:[
        FormsModule,
        RouterModule,
        CommonModule,
        AdminRouting,
        HighchartsChartModule,
        NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    ]
})
export class AdminModule{

}