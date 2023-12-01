import { NgModule } from "@angular/core";
import { AdminloginComponent } from "./components/adminlogin/adminlogin.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { AdminRouting } from "./admin-routing.module.";
import { AdminhomeComponent } from "./components/adminhome/adminhome.component";
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
    declarations:[
        AdminloginComponent,
        AdminhomeComponent
    ],
    imports:[
        FormsModule,
        RouterModule,
        CommonModule,
        AdminRouting,
        HighchartsChartModule
    ]
})
export class AdminModule{

}