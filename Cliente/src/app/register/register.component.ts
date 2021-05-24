import { Component, OnInit } from '@angular/core';
//import { WebSocketService } from '../web-socket.service';
//import { HttpClient } from '@angular/common/http';

interface Question {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(/*private socket: WebSocketService*/) {

  }

  ngOnInit(): void {
  }
  questions: Question[] = [
    {value: 'pregunta1', viewValue: '¿Cual es su comida favorita?'},
    {value: 'pregunta2', viewValue: '¿Cual es el segundo nombre de su padre?'},
    {value: 'pregunta3', viewValue: '¿Cual es el nombre de su primer mascota?'}
  ];
}
