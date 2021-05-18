import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mensajes : Array<String> = [];
  miembros : Object = {};  
  userData : any = {
    name: "",
    id: "",
    description : "",
    profile_picture : ""
  }
  //grupos : Array<String> = ['Ingles III',"Matemática Aplicada"];
  grupos : Object = {    
    
  }
  currentGroup = "";

  constructor(private socket: WebSocketService, private http:HttpClient) {

    this.http.post('http://localhost:3000/grupos/',{}).subscribe(data =>{      
      let userData = JSON.stringify(data);          
      this.grupos = JSON.parse(userData);            
    });    
  }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      this.mensajes.push(data);
    });
  } 
  sendMensaje(mensaje:string){       
    /* let datos:Object = {
      mensaje,
      grupo : this.currentGroup.trim()
    } */
    this.socket.emit('nuevoMensaje',mensaje);    
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
    if(this.miembros && Object.keys(this.miembros).length===0 && this.miembros.constructor===Object){
      console.log('No se han seleccionado miembros');
      return;
    }            
    let integrantes = Object.keys(this.miembros);
    let grupo_n = {nombre: groupName.value, descripcion: groupDescription.value, usuarios:integrantes }
    /*this.socket.socket.emit('crearGrupo',{nombre:groupName.value,descripcion:groupDescription.value}, (id,cb)=>{      
        this.grupos[id] = cb;
    });*/

    this.http.post('http://localhost:3000/createG',grupo_n).subscribe( data =>{
      console.log(data);      
    });

    this.http.post('http://localhost:3000/grupos/',{}).subscribe(data =>{      
      let userData = JSON.stringify(data);                      
      this.grupos = JSON.parse(userData);            
    });    
    this.createComponent(4);
    
  }
  addUser(){
    //TODO: Acá va la lógica de busqueda de usuario en base de datos.
    this.miembros[0] = this.userData;    
    //this.miembros.push(this.userData.name);
    //TODO: Luego de hacer click limpiar los inputs, ver si se puede corregir con componentes dinámicos
  }
  searchUser(id:any){

    this.userData.id = id;
    this.http.post(`http://localhost:3000/usuarios/${id}`,{}).subscribe(data =>{
      //TODO: Parsear mejor los datos.
      let userData = JSON.stringify(data);
      let userData_ = JSON.parse(userData);
      this.miembros[id] = userData_;
      this.userData.name = userData_.nombre;      
      this.userData.description = userData_.descripcion;                      
    });    
    /*
    this.socket.socket.emit('buscarUsuario',id,cb=>{
      if(cb.error){
        console.log('Error');        
        return;
      }
      this.userData.name = cb.usuario.nombre;      
      this.userData.description = cb.usuario.descripcion;
    });      
    */             
  }
  showMessages(groupName:string){
    this.createComponent(4);
    this.currentGroup = groupName;      
  }
}