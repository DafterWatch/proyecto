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
    this.fechaYHoraDeVencimiento= new Date(this.tareaSeleccionada.endDate+" "+this.tareaSeleccionada.horaVencimiento);

   

    this.estadoDeLaTarea="No entregado";


    this.tareaSeleccionada.tareasEntregadasUsuarios.forEach(element => {
      if(element.idEstudiante==this.usuario){
        this.estadoDeLaTarea="Entregado";
      }
    });

  
    console.log(this.tareaSeleccionada.esRecordatorio.trim());
    if(this.tareaSeleccionada.esRecordatorio.trim()=="true"){

    
      var botonEntregarTarea:any =document.getElementById("botonEntregarTarea");
      botonEntregarTarea.style.display="none";
      var botonEntregarTareaArchivo:any =document.getElementById("btnDiscretFile1");
      botonEntregarTareaArchivo.style.display="none";
      this.mensajeEntregarTareaTitulo="Información del recordatorio";
      var miTrabajoTitle:any =document.getElementById("miTrabajoTitle");
      miTrabajoTitle.style.display="none";
      this.mensajefechaEntregarTarea="Fecha y hora de vencimiento"
    }
    else{

      this.mensajeEntregarTareaTitulo="Informacion de la tarea";
      this.mensajefechaEntregarTarea="Fecha y hora de evento"

      if(this.fechaYHoraDeVencimiento<Date.now()){
        var botonEntregarTarea:any =document.getElementById("botonEntregarTarea");
        botonEntregarTarea.style.backgroundColor="red"
        botonEntregarTarea.disabled=true;
      }

    }


    this.numeroTarea=this.tareaSeleccionada.titulo;
    this.fechaVencimiento=this.tareaSeleccionada.endDate;
    this.horaVencimiento=this.tareaSeleccionada.horaVencimiento;
    this.instruccionesTexto=this.tareaSeleccionada.instrucciones;
   

  
  }

  estadoDeLaTarea="";

  
  mensajeEntregarTareaTitulo="";
  mensajefechaEntregarTarea="";
  numeroTarea = 1;
  fechaVencimiento = "5/28/2021";
  horaVencimiento = "15:00";
  instruccionesTexto = "Enviar en español";

  fechaYHoraDeVencimiento;

  @Input() tareaSeleccionada;
  @Input() grupo;
  @Input() usuario;

  @Output() abrirListaTareas = new EventEmitter();
  abrirLista(){
    this.abrirListaTareas.emit();
  }
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';
  changeProfilePicture1(){
    let inputEl : any = document.getElementById('btnDiscretFile1');    
    const formData : FormData = new FormData;   
    this.estadoDeLaTarea="Entregado";
    
    formData.append('upladFile',inputEl.files[0]);
      formData.append('tituloTarea',this.numeroTarea+""); 
      formData.append('fechaVencimiento',this.fechaVencimiento);   
      formData.append('grupo',this.grupo); 
      formData.append('usuario',this.usuario);    
      formData.append('idTarea',this.tareaSeleccionada.idTarea);   
      
      this.http.post(this.DIRECCION_SERVER+'/upload',formData,{responseType: 'text'}).subscribe(
        (res)=>{
          console.log(res);          
        },
        (err)=>console.log(err)
      );

  }
}
