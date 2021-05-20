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
    alert("Mensaje123123 enviado");
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
    alert("Grupo creado")
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
      console.log(data);      
      let userData = JSON.stringify(data[0]);
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
  showGroup(buton:HTMLElement){
    let btn = document.getElementById('btnC');    
    console.log(btn.dataset.idgrupo);    
    this.createComponent(4);    
  }
  // ------------------------------------------------------------------------Menu Grupo -----------------------------------------------------------------------------
  // -------------------De aqui para abajo son funciones del menu de grupos ----------------------------------------
  items = Array.from({length: 10}).map((_, i) => `Item #${i}`);
  public _opened: boolean = false;
  public _modeNum: number = 0;
  public _positionNum: number = 1;
  public _dock: boolean = false;
  public _closeOnClickOutside: boolean = false;
  public _closeOnClickBackdrop: boolean = true;
  public _showBackdrop: boolean = true;
  public _animate: boolean = true;
  public _trapFocus: boolean = true;
  public _autoFocus: boolean = true;
  public _keyClose: boolean = true;
  public _autoCollapseHeight: number = null;
  public _autoCollapseWidth: number = null;
  public _MODES: Array<string> = ['over', 'push', 'slide'];
  public _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  public _toggleOpened(): void {
    this._opened = !this._opened;
  }
  public _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }
  public _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }
  public _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }
  public _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }
  public _toggleDock(): void {
    this._dock = !this._dock;
  }
  public _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }
  public _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }
  public _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }
  public _toggleAnimate(): void {
    this._animate = !this._animate;
  }
  public _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }
  public _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }
  public _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }
  public _onOpenStart(): void {
    console.info('Sidebar opening');
  }
  public _onOpened(): void {
    console.info('Sidebar opened');
  }
  public _onCloseStart(): void {
    console.info('Sidebar closing');
  }
  public _onClosed(): void {
    console.info('Sidebar closed');
  }
  public _onTransitionEnd(): void {
    console.info('Transition ended');
  }
  public _onBackdropClicked(): void {
    console.info('Backdrop clicked');
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------
}