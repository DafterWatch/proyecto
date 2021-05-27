import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calificar-tarea',
  templateUrl: './calificar-tarea.component.html',
  styleUrls: ['./calificar-tarea.component.scss']
})
export class CalificarTareaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  tarea="Tarea 1";
  noentregados = 2;
  entregados = 10;
   data = [
    {nombre:"Estudiante 1", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 2", estado: 'Entregado', puntaje: 80},
    {nombre:"Estudiante 3", estado: 'No Entregado', puntaje: 0},
    {nombre:"Estudiante 4", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 5", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 6", estado: 'No Entregado', puntaje: 0},
    {nombre:"Estudiante 7", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 8", estado: 'Entregado', puntaje: 70},
    {nombre:"Estudiante 9", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 10", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 11", estado: 'Entregado', puntaje: 100},
    {nombre:"Estudiante 12", estado: 'Entregado', puntaje: 100},
  ];
  displayedColumns = ['Nombre', 'Estado', 'Puntaje'];
}
