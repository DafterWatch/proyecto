import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var cantPreguntas = this.preguntas.length;
    console.log(cantPreguntas);
  }
  pregunta = "Sos?";
  preguntas = ["si","no","talvez"];
  multiplesPreguntas = false;  
  value = 50;
  sumar(){
    this.value+=20;
    console.log(this.value);
  }
  cantVotos = 20;
}
