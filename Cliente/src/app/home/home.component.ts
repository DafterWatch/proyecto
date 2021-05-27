import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  currentUserId : any;
  currentUser : any={}; 
  mensajes : Array<String> = [];
  miembros2 = ["a","b","c"]
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
  //currentNewgroupAdmin:Number=-1;
  NewGroupAdmins:Array<Number> = [];
  grupos : any = {    
    
  }
  currentGroup = "";
  currentDescription="Desc:";

  constructor(private socket: WebSocketService, private http:HttpClient) {

    this.currentUserId = sessionStorage.getItem('currentUser');
    console.log(this.currentUserId);    
    this.http.post(`http://localhost:3000/usuarios/${this.currentUserId}`,{}).subscribe(data=>{
        let aux = JSON.stringify(data);         
        this.currentUser = JSON.parse(aux);   

        this.http.post('http://localhost:3000/gruposId/',this.currentUser.grupos).subscribe(data =>{      
          let userData = JSON.stringify(data);          
          this.grupos = JSON.parse(userData);                                       
        }); 

    });  
    
    
          

  }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      this.mensajes.push(data);
    });
    this.socket.listen('nuevoGrupo').subscribe((data:any)=>{            
      this.grupos.push(data);      
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
    //this.currentNewgroupAdmin=-1;
    this.NewGroupAdmins = [];

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
      //this.currentNewgroupAdmin=-1;
      this.NewGroupAdmins = [];
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
      var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
      checkBoxAdmin.disabled=false;
      this.cleanAddMemberFields();

    }
    if(index == 4){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
    }
  }

  createGroup(){




    this.http.post('http://localhost:3000/grupos/',this.currentUser.grupos).subscribe(data1 =>{      
      let userData = JSON.stringify(data1);          
      var groupSistems:[] = JSON.parse(userData); 

      
    let groupName:any = document.getElementById('idInputNombreDegrupo');
    let groupDescription:any = document.getElementById('idDescripcionDeGrupo'); 

    if(this.miembros && Object.keys(this.miembros).length===0 && this.miembros.constructor===Object){
      console.log('No se han seleccionado miembros');
      return;
    }            
    let integrantesGrupo=[];
    for (let miembro of this.miembros) {
          integrantesGrupo.push(miembro.id)
    }
    integrantesGrupo.push(this.currentUserId);
    /* array.forEach es 50% más lento que el for normal
    this.miembros.forEach(element => {
      integrantesGrupo.push(element.id)
    });
    */
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
        admin:this.NewGroupAdmins
        //admin:this.currentNewgroupAdmin
    };
    let grupo_n = {id:groupSistems.length+1, miembrosDelGrupo:miembrosDelGrupo,informacion:informacionDelGrupo1,mensaje:mensaje}
 
    
    this.http.post('http://localhost:3000/createG',grupo_n).subscribe( data =>{
      console.log(data);      
    });
    let data = {
      ids: integrantesGrupo,
      infoGrupo:grupo_n
    }
    this.socket.emit('nuevoGrupo',data);
    /*
    Deprecamos este post xd 
    this.http.post('http://localhost:3000/grupos/',{}).subscribe(data =>{      
      let userData = JSON.stringify(data);                      
      this.grupos = JSON.parse(userData); 
    });    
    */
    this.createComponent(4);

    });      
  
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
  addMember(){
 
    const userdata2 = this.copy(this.userData);
    var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
  
    var newMemberAdmin=false;
    if(checkBoxAdmin.checked){
      newMemberAdmin=true;
    }
    const idNewMember=userdata2.id;
    this.currentGroupId;
    newMemberAdmin;
    this.http.post(`http://localhost:3000/addfromGroup/${idNewMember}/${this.currentGroupId}/${newMemberAdmin}`,{}).subscribe(data =>{
   
   
    }); 
    alert("Se añadió un nuevo miembro al grupo");
    this.createComponent(1);  
  }
  addUser(){

        console.log(this.miembros);
          const userdata2 = this.copy(this.userData);
        
          var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
          checkBoxAdmin.disabled=false;
          if(checkBoxAdmin.checked){
            
            this.NewGroupAdmins.push(userdata2.id);
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

  addMemberCommon(){
  
    this.cleanCreateGroupFields();
    var addMemberToGroup = document.getElementById('addMemberToGroup');
    var addMemberButton = document.getElementById('addMemberButton');
    addMemberToGroup.style.display="none";
    addMemberButton.style.display="flex";
    this.createComponent(2)
   
  }
  addMemberToGroup(){
  

    var addMemberToGroup = document.getElementById('addMemberToGroup');
    var addMemberButton = document.getElementById('addMemberButton');
    addMemberToGroup.style.display="flex";
    addMemberButton.style.display="none";
    this.createComponent(3)
   
  }
  searchUser(id:any){

      
      this.userData.id = id;
      this.http.post(`http://localhost:3000/usuarios/${id}`,{}).subscribe(data =>{
      //TODO: Parsear mejor los datos.
           
      let userData = JSON.stringify(data);
      let userData_ = JSON.parse(userData);

     
      this.userData.name = userData_.nombre;      
      this.userData.description = userData_.descripcion;
              
    });    
  }

  currentGroupId;
  deleteMember(buton:any){


    this.http.post(`http://localhost:3000/DeletefromGroup/${buton.value.id}/${this.currentGroupId}`,{}).subscribe(data =>{

    }); 
    alert("Miembro borrado");

      
  }


  showGroup(buton:any){

    this.currentMembers=[]; 

    this.currentGroup=buton.informacion.nombre;   
    this.currentDescription=buton.informacion.descripcion;
    this.currentGroupId=buton.id;
    console.log(this.currentGroupId);
    this.currentGroupItems=buton.miembrosDelGrupo.integrantes;


    this.currentGroupItems.forEach(element => {
        this.http.post(`http://localhost:3000/usuarios/${element}`,{}).subscribe(data =>{

        let userData2 = JSON.stringify(data);
 
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