import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';

@Component({
  selector: 'app-lista-tareas1',
  templateUrl: './lista-tareas1.component.html',
  styleUrls: ['./lista-tareas1.component.scss']
})
export class ListaTareas1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {

    console.log(this.tareas[0]);
   
    this.items=this.tareas[0].tareas;

    this.cantidadIntegrantes=this.tareas[0].miembrosDelGrupo.integrantes.length;
    
    this.entregados=this.entregados-1;

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

  verTareaMetodo(x,itme){


  
    if(itme.esRecordatorio.trim()=="false"){
      this.verTarea.emit(x);
    }
   

   
  }
  
}
