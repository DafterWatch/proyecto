import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-tareas1',
  templateUrl: './lista-tareas1.component.html',
  styleUrls: ['./lista-tareas1.component.scss']
})
export class ListaTareas1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  items = Array.from({length: 100}).map((_, i) => `Tarea ${i}`);
  totalEntregas = 11;
  entregados = 5;
}
