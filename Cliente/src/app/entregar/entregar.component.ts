import { Input,Output,EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.component.html',
  styleUrls: ['./entregar.component.scss']
})
export class EntregarComponent implements OnInit {

  form : FormGroup;
  constructor(private fb: FormBuilder, private http:HttpClient) {
     this.form = this.fb.group({
    img: [null],
    filename: ['']
  })}

  groupImage = "";
  imageFile : any;

  ngOnInit(): void {
    this.numeroTarea=this.tareaSeleccionada.titulo;
    this.fechaVencimiento=this.tareaSeleccionada.endDate;
    this.horaVencimiento=this.tareaSeleccionada.horaVencimiento;
    this.instruccionesTexto=this.tareaSeleccionada.instrucciones;
    console.log(this.grupo);
    console.log(this.usuario);
    console.log(this.tareaSeleccionada);
  }
  numeroTarea = 1;
  fechaVencimiento = "5/28/2021";
  horaVencimiento = "15:00";
  instruccionesTexto = "Enviar en español";

  @Input() tareaSeleccionada;
  @Input() grupo;
  @Input() usuario;

  @Output() abrirListaTareas = new EventEmitter();
  abrirLista(){
    this.abrirListaTareas.emit();
  }

  changeProfilePicture1(){
    let inputEl : any = document.getElementById('btnDiscretFile1');    
    const formData : FormData = new FormData;   
    
    formData.append('upladFile',inputEl.files[0]);
      formData.append('tituloTarea',this.numeroTarea+""); 
      formData.append('fechaVencimiento',this.fechaVencimiento);   
      formData.append('grupo',this.grupo); 
      formData.append('usuario',this.usuario);    
      formData.append('idTarea',this.tareaSeleccionada.idTarea);   
      
      this.http.post('http://localhost:3000/upload',formData,{responseType: 'text'}).subscribe(
        (res)=>{
          console.log(res);          
        },
        (err)=>console.log(err)
      );

      alert("Tarea entregada con exito");
  }
}
