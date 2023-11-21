import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ChatComponent } from './components/chat/chat.component';
import { PersonComponent } from './person/person.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: BodyComponent },
  {path:'signup', component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'login/feed', component:FeedComponent},
  {path:'login/profile', component:ProfileComponent},
  {path:'login/profile/edit', component:EditprofileComponent},
  {path:'login/wishlist', component:WishlistComponent},
  {path:'login/chat', component:ChatComponent,
   children:[
    {path:':userid', component:PersonComponent}
   ]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }