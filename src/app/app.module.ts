import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';

import { environment } from 'src/environments/environment';

import {AngularFireAuth} from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AngularFireAuth

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
