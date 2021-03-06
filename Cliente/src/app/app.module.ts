import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';

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
import { ErrorStateMatcher, MatNativeDateModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
//List
import {MatListModule} from '@angular/material/list';
//Scrolling
import {ScrollingModule} from '@angular/cdk/scrolling';
//Menu
import {MatMenuModule} from '@angular/material/menu';
//Select
import {MatSelectModule} from '@angular/material/select';
//Calender
import {MatToolbarModule} from '@angular/material/toolbar';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 

FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);
//Table
import { MatTableModule } from '@angular/material/table';
//Date Picker
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//FormReactive
import { ReactiveFormsModule } from '@angular/forms';
//ProgressBar
import {MatProgressBarModule} from '@angular/material/progress-bar';


//HTPP
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { ChatGroupComponent } from './home/chat-group/chat-group.component';
import { CreateGroupComponent } from './home/create-group/create-group.component';
import { AddMemberComponent } from './home/add-member/add-member.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { CalenderComponent } from './calender/calender.component';
import { ListaTareas1Component } from './lista-tareas1/lista-tareas1.component';
import { ListaTareas2Component } from './lista-tareas2/lista-tareas2.component';
import { CalificarTareaComponent } from './calificar-tarea/calificar-tarea.component';
import { CrearComponent } from './crear/crear.component';
import { EntregarComponent } from './entregar/entregar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioComponent } from './inicio/inicio.component';
import { CrearFormularioComponent } from './crear-formulario/crear-formulario.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';

import {MatDialogModule, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormularioComponent } from './formulario/formulario.component';
import { DynamicModule } from 'ng-dynamic-component';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { InterceptorService } from './interceptor.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdministradorComponent } from './administrador/administrador.component';
import { UsuarioReportadoComponent } from './modalesAdmin/usuario-reportado/usuario-reportado.component';
import { InformeReporteComponent } from './modalesAdmin/informe-reporte/informe-reporte.component';
import { BuscarUsuarioComponent } from './buscar-usuario/buscar-usuario.component';
import { ReportesClienteComponent } from './modalesAdmin/reportes-cliente/reportes-cliente.component';
import { MatBadgeModule } from '@angular/material/badge'
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReconocimientoFacialComponent } from './reconocimiento-facial/reconocimiento-facial.component';
import { RegistrarFacialComponent } from './registrar-facial/registrar-facial.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    RegisterComponent,
    AccountRecoveryComponent,
    CalenderComponent,
    ListaTareas1Component,
    ListaTareas2Component,
    CalificarTareaComponent,
    CrearComponent,
    EntregarComponent,
    PerfilComponent,
    InicioComponent,
    CrearFormularioComponent,
    FormularioComponent,
    NavegacionComponent,
    AdministradorComponent,
    UsuarioReportadoComponent,
    InformeReporteComponent,
    BuscarUsuarioComponent,
    ReportesClienteComponent,
    ReconocimientoFacialComponent,
    RegistrarFacialComponent,

  ],
  imports: [    
    MatDialogModule,
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
    //Calender
    FullCalendarModule,
    MatToolbarModule,
    //Table
    MatTableModule,
    //Date
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    //ReactForm
    ReactiveFormsModule,
    //CheckBox
    MatCheckboxModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSliderModule,
    DynamicModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  bootstrap: [AppComponent],
  providers: [ErrorStateMatcher,{provide:MAT_DIALOG_DATA,useValue: {}},{provide:MatDialogRef,useValue: {}}, {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
],
  entryComponents: [ChatGroupComponent,CreateGroupComponent,AddMemberComponent]

})
export class AppModule { }
