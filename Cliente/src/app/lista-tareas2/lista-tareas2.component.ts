import { Component, OnInit,Input,EventEmitter ,Output} from '@angular/core';

@Component({
  selector: 'app-lista-tareas2',
  templateUrl: './lista-tareas2.component.html',
  styleUrls: ['./lista-tareas2.component.scss']
})
export class ListaTareas2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(this.tareas);
    
    this.items=this.tareas[0].tareas;
  }
  items = Array.from({length: 100}).map((_, i) => `Tarea ${i}`);
  @Input() tareas;
  @Output() verTarea= new EventEmitter<any>();

  verTareaMetodo(x){
    this.verTarea.emit(x);
  }

  @Output() cerrarVentana = new EventEmitter();
  cerrar(){
    this.cerrarVentana.emit();
  }
}
