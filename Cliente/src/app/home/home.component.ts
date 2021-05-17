import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mensajes : Array<String> = [];
  miembros : Array<String> = [];  
  userData = {
    name: "",
    id: "",
    description : "",
    profile_picture : ""
  }
  //grupos : Array<String> = ['Ingles III',"Matemática Aplicada"];
  grupos : Object = {    
    1:{
      nombre : 'Ingles III',
      descripcion : 'Grupo de Inglés'
    }
  }
  currentGroup = "";

  constructor(private socket: WebSocketService) { }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      this.mensajes.push(data);
    });
  } 
  sendMensaje(mensaje:string){
    let datos:Object = {
      mensaje,
      grupo : this.currentGroup.trim()
    } 
    //this.socket.emit('nuevoMensaje',mensaje);    
  } 
  value:string = "";
  
  createComponent(index){
    var chatWindow = document.getElementById('chatContainer');
    var groupWindow = document.getElementById('groupContainer');
    var addMemberWindow = document.getElementById('addMemberContainer');

    //REVISAR!!!
    if(index==1){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
      
    }
    if(index==2){
      chatWindow.style.display="none";
      groupWindow.style.display="flex";
      addMemberWindow.style.display="none";
    }
    if(index==3){
      chatWindow.style.display="none";
      groupWindow.style.display="none";
      addMemberWindow.style.display="flex";
    }
    if(index == 4){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
    }
  }

  createGroup(){
    let groupName:any = document.getElementById('txtGroupName');
    let groupDescription:any = document.getElementById('txtGroupDescription');    
    if(this.miembros.length == 0){
      console.log('No se han seleccionado miembros');
      return;
    }        
   
    this.socket.socket.emit('crearGrupo',{nombre:groupName.value,descripcion:groupDescription.value}, (id,cb)=>{      
        this.grupos[id] = cb;
    });
    this.createComponent(4);
    //TODO: Mandar evento de Socket IO para los grupos. 
  }
  addUser(){
    //TODO: Acá va la lógica de busqueda de usuario en base de datos.
        
    this.miembros.push(this.userData.name);
    //TODO: Luego de hacer click limpiar los inputs, ver si se puede corregir con componentes dinámicos
  }
  searchUser(id:any){
    this.userData.id = id;
    //let usuario = this.socket.emit('buscarUsuario',id);   
    this.socket.socket.emit('buscarUsuario',id,cb=>{
      if(cb.error){
        console.log('Error');        
        return;
      }
      this.userData.name = cb.usuario.nombre;      
      this.userData.description = cb.usuario.descripcion;
    });                   
  }
  showMessages(groupName:string){
    this.createComponent(4);
    this.currentGroup = groupName;      
  }
}