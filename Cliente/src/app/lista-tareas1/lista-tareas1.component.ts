import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';

@Component({
  selector: 'app-lista-tareas1',
  templateUrl: './lista-tareas1.component.html',
  styleUrls: ['./lista-tareas1.component.scss']
})
export class ListaTareas1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
   
    this.items=this.tareas[0].tareas;

    this.cantidadIntegrantes=this.tareas[0].miembrosDelGrupo.integrantes.length;
    
    

  }
  items = Array.from({length: 100}).map((_, i) => `Tarea ${i}`);
  totalEntregas = 11;
  entregados = 5;
  @Input() tareas;

  cantidadIntegrantes:any;
  
  @Output() cerrarVentana = new EventEmitter();
  cerrar(){
    this.cerrarVentana.emit();
  }

  @Output() crearTarea= new EventEmitter();

  emitirCrearTarea(){
    this.crearTarea.emit();
  }

  @Output() verTarea= new EventEmitter<any>();

  verTareaMetodo(x){
    this.verTarea.emit(x);
  }
}
