import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { ChatComponent } from './components/chat/chat.component';

import { WishlistComponent } from './wishlist/wishlist.component';
import { PersonComponent } from './person/person.component';
import { AuthGuard } from './services/authguard.guard';
import { RequestComponent } from './components/request/request.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: BodyComponent },
  {path:'signup', component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'forgotpassword', component:ForgotpasswordComponent},
  {path:'login/feed', component:FeedComponent, canActivate:[AuthGuard]},
  {path:'login/profile', component:ProfileComponent ,canActivate:[AuthGuard]},
  {path:'login/request', component:RequestComponent ,canActivate:[AuthGuard]},
  {path:'login/profile/edit', component:EditprofileComponent, canActivate:[AuthGuard]},
  {path:'login/wishlist', component:WishlistComponent,canActivate:[AuthGuard]},
  {path:'login/chat', component:ChatComponent, 
   children:[
    {path:':userid', component:PersonComponent}
   ],canActivate:[AuthGuard]},
   {
    path: 'admin',
    loadChildren: () => import('./admin.module').then((m) => m.AdminModule),
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  providers:[AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
