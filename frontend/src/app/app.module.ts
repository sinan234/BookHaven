import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule ,ToastrService} from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenvalidationService } from './services/tokenvalidation.service';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { StoreModule } from '@ngrx/store';
import { headerReducer } from './store-ngrx/search.reduce';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ChatComponent } from './components/chat/chat.component';
import { PersonComponent } from './person/person.component';
import { io } from 'socket.io-client';
import { messageReducer } from './store-ngrx/message.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MessageEffects } from './store-ngrx/message.effect';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AdminModule } from './admin.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RequestComponent } from './components/request/request.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    SignupComponent,
    LoginComponent,
    FeedComponent,
    ProfileComponent,
    EditprofileComponent,
    WishlistComponent,
    ChatComponent,
    PersonComponent,
    RequestComponent
  ],
  imports: [
    BrowserModule,
    PickerModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgOptimizedImage,
    AdminModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    HttpClientModule,
    StoreModule.forRoot({
      header:headerReducer,
      messages:messageReducer
    }),
    EffectsModule.forRoot([
      MessageEffects
    ]),
    
  ],
  providers: [
    { provide: 'Socket', useValue: io },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenvalidationService,
      multi: true,
    },
    ToastrService,

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { }
