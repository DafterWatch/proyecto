import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
import {HttpHeaders} from "@angular/common/http";
import { HttpParams } from '@angular/common/http';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-calificar-tarea',
  templateUrl: './calificar-tarea.component.html',
  styleUrls: ['./calificar-tarea.component.scss']
})
export class CalificarTareaComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
 

    
    this.data=this.tareaSeleccionada.tareasEntregadasUsuarios;
    this.tarea=this.tareaSeleccionada.titulo;

    this.puntaje=this.tareaSeleccionada.puntos;


  }
  puntaje;
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

  @Input() tareaSeleccionada;
  @Input() idGrupo;

  @Input() Usuario;
  @Input() NoEntregadasTareas;
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';
  puntajeActual="";
  onBlur(value) {
    this.puntajeActual=value;
  }

  @Output() abrirListaTareas = new EventEmitter();
  abrirLista(){
    this.abrirListaTareas.emit();
  }
  
  
calificarTarea(tareaEstudiante){
  var inputCalificacion:any=document.getElementById("puntajeInput");
  console.log(this.tareaSeleccionada);
  console.log(tareaEstudiante);
  this.http.post(this.DIRECCION_SERVER+'/calificarTarea',{responseType: 'text',params:{"tareaSeleccionada":this.tareaSeleccionada.idTarea,"idEstudiante":tareaEstudiante.idEstudiante,"calificacion":this.puntajeActual,"idGrupo":this.idGrupo}}).subscribe(
        (res)=>{
          console.log(res);          
        },
        (err)=>console.log(err)
      );


}
 
descargarTarea(idArchivoTarea){

  this.http.get(this.DIRECCION_SERVER+'/getInformacionArchivo',{responseType:"json",params:{"idTareaNube":idArchivoTarea.idTareaNube}}).subscribe(
    (res)=>{
      this.http.get(this.DIRECCION_SERVER+'/descargarTarea',{responseType:"blob",params:{"idTareaNube":idArchivoTarea.idTareaNube}}).toPromise()
      .then(blob => {
          saveAs(blob, res); 
      })         
    },
    (err)=>console.log(err)
  );

  
}
}
