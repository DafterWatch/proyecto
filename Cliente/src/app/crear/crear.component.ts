import { Component, OnInit,Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  @Output() cerrarCrearTarea = new EventEmitter();
  cerrarCTarea(){
    this.cerrarCrearTarea.emit();
  }


  @Output() asignarTarea= new EventEmitter<any>();

  AsignarTarea(){
    var tituloDom:any=document.getElementById("titulo");
    var instruccionesDom:any=document.getElementById("instrucciones");
    var puntosMaxDom:any=document.getElementById("puntosMax");
    var startDateDom:any=document.getElementById("startDate");
    var endDateDom:any=document.getElementById("endDate");

    var horaVencimientoDom:any=document.getElementById("horaVencimiento");
    var esRecordatorioDom:any=document.getElementById("esRecordatorio");
    console.log(esRecordatorioDom);
    var informacionTarea={
      titulo:tituloDom.value,
      instrucciones:instruccionesDom.value,
      puntos:puntosMaxDom.value,
      startDate:startDateDom.value,
      endDate:endDateDom.value,
      horaVencimiento:horaVencimientoDom.value,
      esRecordatorio:esRecordatorioDom.checked,
    }
   

    this.asignarTarea.emit(informacionTarea);
  }
  desactivarPuntaje(){
    var esRecordatorioDom:any=document.getElementById("esRecordatorio");
    var puntosMaxDom:any=document.getElementById("puntosMax");
    if(esRecordatorioDom.checked){
      puntosMaxDom.disabled=true;
    }
    else{
      puntosMaxDom.disabled=false;
    }
  }
}
