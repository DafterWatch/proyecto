import { Component, OnInit } from '@angular/core';

interface Question {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.scss']
})
export class AccountRecoveryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  questions: Question[] = [
    {value: 'pregunta1', viewValue: '¿Cual es su comida favorita?'},
    {value: 'pregunta2', viewValue: '¿Cual es el segundo nombre de su padre?'},
    {value: 'pregunta3', viewValue: '¿Cual es el nombre de su primer mascota?'}
  ];
}
