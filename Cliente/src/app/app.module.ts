import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { GroupMenuComponent } from './group-menu/group-menu.component'
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
//List
import {MatListModule} from '@angular/material/list';
//Scrolling
import {ScrollingModule} from '@angular/cdk/scrolling';
//Menu
import {MatMenuModule} from '@angular/material/menu';
//Select
import {MatSelectModule} from '@angular/material/select';

//HTPP
import {HttpClientModule} from '@angular/common/http';
import { ChatGroupComponent } from './home/chat-group/chat-group.component';
import { CreateGroupComponent } from './home/create-group/create-group.component';
import { AddMemberComponent } from './home/add-member/add-member.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    HomeComponent,
    PageNotFoundComponent,
    GroupMenuComponent,
    ChatGroupComponent,
    CreateGroupComponent,
    AddMemberComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    MatInputModule,
    //List
    MatListModule,
    //Scroll
    ScrollingModule,
    MatMenuModule,
    //Select
    MatSelectModule,
  ],
  bootstrap: [AppComponent],
  providers: [ErrorStateMatcher]
})
export class AppModule { }
