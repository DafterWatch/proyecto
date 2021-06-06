import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit,ViewChild } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import {Router} from '@angular/router';
import {ChatGroupComponent} from '../home/chat-group/chat-group.component';



import { CrearFormularioComponent } from '../crear-formulario/crear-formulario.component';
import {MatDialog} from '@angular/material/dialog';
import { CalenderComponent } from '../calender/calender.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.scss']
})
export class NavegacionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

 ////////////////////////////////////////////////////////////
 currentComponent = null;
 inputs = {
   hello: 'world',
   something: () => 'can be really complex',
 };
 outputs = {
   onSomething: type => alert(type),
 };
 openCalendar(){
   this.currentComponent=CalenderComponent;
 }
 openProfile(){
   this.currentComponent=PerfilComponent;
 }
 openGroups(){
  this.currentComponent=HomeComponent;
}

 /////////////////////////////////////////////////////////////
}
