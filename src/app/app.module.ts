import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
//Demo
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SidebarModule } from 'ng-sidebar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DemoComponent } from './demo/demo.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//Buttons
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//Label
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//Card
import {MatCardModule} from '@angular/material/card';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    //demo
    SidebarModule.forRoot(),
    MatSidenavModule,
    //icons
    MatIconModule,
    MatButtonModule,
    //Label
    FormsModule, 
    MatFormFieldModule,
    //Card
    MatCardModule,
    //Input
    MatInputModule
  ],
  bootstrap: [AppComponent],
  providers: [ErrorStateMatcher]
})
export class AppModule { }
