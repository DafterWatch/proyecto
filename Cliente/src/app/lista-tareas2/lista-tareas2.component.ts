import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-tareas2',
  templateUrl: './lista-tareas2.component.html',
  styleUrls: ['./lista-tareas2.component.scss']
})
export class ListaTareas2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  items = Array.from({length: 100}).map((_, i) => `Tarea ${i}`);
}
