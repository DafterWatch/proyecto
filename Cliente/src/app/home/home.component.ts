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
  miembros =[];
  miembroscount=0;
  currentMembers=[];
  currentGroupItems=[];
  userData : any = {
    name: "",
    id: "",
    description : "",
    profile_picture : ""
  }
  currentNewgroupAdmin:Number=-1;
  grupos : Object = {    
    
  }
  currentGroup = "";
  currentDescription="Desc:";

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
    this.socket.emit('nuevoMensaje',mensaje);    
  } 

  cleanCreateGroupFields(){
    var groupName:any =document.getElementById('idInputNombreDegrupo');
    var groupDescription:any  = document.getElementById('idDescripcionDeGrupo');
    
    groupName.value="";
    groupDescription.value="";
    this.miembros=[];
    this.currentNewgroupAdmin=-1;

  }
  cleanAddMemberFields(){
    var searchUser:any =document.getElementById('fieldToSearchUser');
    searchUser.value="";
    this.userData={}
  }

  value:string = "";
  
  createComponent(index){
    var chatWindow = document.getElementById('chatContainer');
    var groupWindow = document.getElementById('groupContainer');
    var addMemberWindow = document.getElementById('addMemberContainer');

    if(index==1){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
      this.currentNewgroupAdmin=-1;
      
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
      this.cleanAddMemberFields();
      var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
      if(this.currentNewgroupAdmin!=-1){

        checkBoxAdmin.disabled=true;
      }
      else{
        checkBoxAdmin.disabled=false;
      }
    }
    if(index == 4){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
    }
  }

  createGroup(){


    let groupsQuantity=0;
    for (const group in this.grupos) {
      groupsQuantity++;
    }
    alert("Grupo creado")
    let groupName:any = document.getElementById('idInputNombreDegrupo');
    let groupDescription:any = document.getElementById('idDescripcionDeGrupo'); 

    if(this.miembros && Object.keys(this.miembros).length===0 && this.miembros.constructor===Object){
      console.log('No se han seleccionado miembros');
      return;
    }            
    let integrantesGrupo=[];
    this.miembros.forEach(element => {
      integrantesGrupo.push(element.id)
    });
    let informacionDelGrupo1={
      nombre: groupName.value,
      descripcion:groupDescription.value,
      foto:""
    }
    let mensaje:{
      archivo:{
          mensaje:"",
          remitente:"",
          hora:Date
      }
    }

    let miembrosDelGrupo={
        integrantes:integrantesGrupo,
        admin:this.currentNewgroupAdmin
    };
    let grupo_n = {id: groupsQuantity, miembrosDelGrupo:miembrosDelGrupo,informacion:informacionDelGrupo1,mensaje:mensaje}
 
    
    this.http.post('http://localhost:3000/createG',grupo_n).subscribe( data =>{
      console.log(data);      
    });
    this.http.post('http://localhost:3000/grupos/',{}).subscribe(data =>{      
      let userData = JSON.stringify(data);                      
      this.grupos = JSON.parse(userData); 
    });    
    this.createComponent(4);
  }
  copy (obj) {
    let result;
    if (typeof obj === 'object') {
      result = new obj.constructor();
    } else {
      return obj;
    }
    for (let prop of Reflect.ownKeys (obj)) {
      result[ prop ] = this.copy (obj[ prop ]);
    }
    return result;
  }
  addUser(){

    const userdata2= this.copy(this.userData);
    
    var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
    if(checkBoxAdmin.checked && checkBoxAdmin.disabled==false){
   
      this.currentNewgroupAdmin=userdata2.id;
    
    }
    
    var userAlreadyRegistered=false;
    this.miembros.forEach(element => {
      if(userdata2.id==element.id){
        userAlreadyRegistered=true;
      }
    });
    
    if(!userAlreadyRegistered){
      this.miembros[this.miembroscount]=userdata2;
      this.miembroscount++;
    }
    else{
      alert("¡¡Usuario ya registrado!!");
      this.createComponent(3);  
    }
 
  }
  searchUser(id:any){

      
      this.userData.id = id;
      this.http.post(`http://localhost:3000/usuarios/${id}`,{}).subscribe(data =>{
      //TODO: Parsear mejor los datos.
           
      let userData = JSON.stringify(data[0]);
      let userData_ = JSON.parse(userData);

     
      this.userData.name = userData_.nombre;      
      this.userData.description = userData_.descripcion;
              
    });    
  }
  showGroup(buton:any){

    this.currentMembers=[]; 

    this.currentGroup=buton.informacion.nombre;   
    this.currentDescription=buton.informacion.descripcion;
    this.currentGroupItems=buton.miembrosDelGrupo.integrantes;

    this.currentGroupItems.forEach(element => {
        this.http.post(`http://localhost:3000/usuarios/${element}`,{}).subscribe(data =>{
        let userData2 = JSON.stringify(data[0]);
        let userData2_ = JSON.parse(userData2);
        this.currentMembers.push(userData2_);
      }); 
    });
    this.createComponent(4);    
  }
  // ------------------------------------------------------------------------Menu Grupo -----------------------------------------------------------------------------
  // -------------------De aqui para abajo son funciones del menu de grupos ----------------------------------------
  public items = [];
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