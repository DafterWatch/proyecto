import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit,ViewChild } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import {Router} from '@angular/router';
import {ChatGroupComponent} from '../home/chat-group/chat-group.component';



import { CrearFormularioComponent } from '../crear-formulario/crear-formulario.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  @ViewChild(ChatGroupComponent) chatGroupComponent:ChatGroupComponent;

  currentUserId : any;
  currentUser : any=null; 
  mensajes : Array<String> = [];
  miembros2 = ["a","b","c"]
  miembros =[];
  miembroscount=0;
  currentMembers=[];
  currentGroupItems=[];
  userData : any = {}  
  NewGroupAdmins:Array<Number> = [];
  grupos : any = {}
  currentGroup = "";
  currentDescription="Desc:";
  router;
  constructor(private socket: WebSocketService, private http:HttpClient, private route:Router,public dialog: MatDialog) {

    this.currentUserId = sessionStorage.getItem('currentUser');    
    /* BORRAR LUEGO
    this.http.post(`http://localhost:3000/usuarios/${this.currentUserId}`,{}).subscribe(async data=>{
        let aux = await JSON.stringify(data);         
        this.currentUser = JSON.parse(aux);   
        
        this.http.post('http://localhost:3000/gruposId/',this.currentUser.grupos).subscribe(data =>{      
          let userData = JSON.stringify(data);          
          this.grupos = JSON.parse(userData);                                       
        });
    });
    */  
    this.generateUserData();

    this.router = route;    
    
  }
  dialogRef : any = null;
  resultadoDormulario:String;

  openDialog(): void {
    this.dialogRef = this.dialog.open(CrearFormularioComponent, {
      width: '50%',
      data: {user: this.currentUser, groupId : this.currentGroupId, membersList : this.currentGroupItems}
    });    

    /*this.dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      alert(result);
    });*/
  }


  async generateUserData() {
    await this.http.post(`http://localhost:3000/usuarios/${this.currentUserId}`,{}).toPromise().then(data =>{
        let aux = JSON.stringify(data);         
        this.currentUser = JSON.parse(aux);
    });

    this.http.post('http://localhost:3000/gruposId/',this.currentUser.grupos).subscribe(data =>{      
          let userData = JSON.stringify(data);          
          this.grupos = JSON.parse(userData);                                                                     
    });
    
  }

  hclick = false;
  si = true;
  isAdmin2(){ 
    this.http.post(`http://localhost:3000/isAdmin/${this.currentUserId}/${this.currentGroupId}`,{}).subscribe(data =>{
      if(data){
        this.si = true;
      } else {      
        this.si = false;
      }
    });
    this.hclick = true;
    console.log(this.si+" estado");
  }
  isAdmin(){    
    this.http.post(`http://localhost:3000/isAdmin/${this.currentUserId}/${this.currentGroupId}`,{}).subscribe(data =>{
      if(data){
        this.router.navigate(['/', 'homework1']);
      } else {      
        this.router.navigate(['/', 'homework2']);
      }
    });
  }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      if(this.chatGroupComponent){      
        this.chatGroupComponent.addMessageToList(data);
      }
    });
    this.socket.listen('nuevoGrupo').subscribe((data:any)=>{            
      this.grupos.push(data);      
    });
    this.socket.listen('admin-nuevo').subscribe((data:any)=>{
      alert('Te acaban de ascender a administrador')
    });
    this.socket.listen('salir-grupo').subscribe((data:any) =>{
      alert(data.mensaje);
      //TODO:Colocar un mensaje de alaerta en los mensajes: 
      for (let index = 0; index < this.grupos.length; index++) {
        const element = this.grupos[index];
        if(element.id == data.groupId){
          this.grupos.splice(index,1);
        }
      }
    });
    

    this.socket.listen('group-info-change').subscribe((data:any)=>{
      //campo,nuevoCampo, idGroup  
      let idg = parseInt(data.idGroup)
      if(idg === this.currentGroupId){
        //TODO: Recuperar las etiquetas y cambiar la información
        if(data.campo === "nombre"){
          this.currentGroup = data.nuevoCampo;

        }else if(data.campo === "descripcion"){
          this.currentDescription = data.nuevoCampo;
        }
        
      }
      for (let index = 0; index < this.grupos.length; index++) {        
        const element = this.grupos[index];                       
        if(element.id === idg){
          if(data.campo === "nombre"){
            element.informacion.nombre = data.nuevoCampo;          
          }else if(data.campo === "descripcion"){
            element.informacion.descripcion = data.nuevoCampo;          
          }                    
        }        
      }          
      
    });

    this.socket.listen('quitar-admin').subscribe((data:any)=>{
      alert('Te han quitado privilegios de administrador');
    });
    this.socket.listen('usuario-nuevo').subscribe((data:any)=>{      
      this.grupos.push(data);
    });
    this.socket.listen('nuevo-form').subscribe((data:any)=>{
      if(this.chatGroupComponent){      
        this.chatGroupComponent.addMessageToList(data);
      }
    });
    this.socket.listen('respuesta-form').subscribe((data:any)=>{
      if(this.chatGroupComponent){      
        this.chatGroupComponent.updateFormAnswers(data);
      }
    });
  } 

  sendMensaje(message:any){         
    
    this.socket.emit('nuevoMensaje',{idGrupo:this.currentGroupId, mensaje:message});    
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
      this.hclick = false;
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

  async createGroup(){

    let groupName =<HTMLInputElement> document.getElementById('idInputNombreDegrupo');
    let groupDescription =<HTMLInputElement> document.getElementById('idDescripcionDeGrupo'); 

    if(this.miembros && Object.keys(this.miembros).length===0 && this.miembros.constructor===Object){
      alert('No se han seleccionado miembros')
      return;
    } 

    let integrantesGrupo=[];
    for (let miembro of this.miembros) {
          integrantesGrupo.push(miembro.id)
    }
    integrantesGrupo.push(this.currentUserId);

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
    this.NewGroupAdmins.push(this.currentUserId);

    let miembrosDelGrupo={
        integrantes:integrantesGrupo,
        admin:this.NewGroupAdmins        
    };
    let idGroup:number = -1;
            
    await this.http.post('http://localhost:3000/getGroupCount',{}).toPromise().then((data:any) => idGroup = data.conteo);            
    idGroup++;    
    if(idGroup === -1){
      alert('Erro con el id de grupo');
      return;
    }
    
    let grupo_n = {id:idGroup, miembrosDelGrupo:miembrosDelGrupo,informacion:informacionDelGrupo1,mensaje:mensaje}    
    let data = {
      ids: integrantesGrupo,
      infoGrupo:grupo_n
    }
    
    this.socket.socket.emit('nuevoGrupo',data,cb=>{
      if(cb.err){
        console.log(cb.error);        
      }
    });
    this.createComponent(4);
    
    //BORRAR TODO DE AQUÍ PARA ABAJO    
    /*
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
    this.createComponent(4);

    });      
    */
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
    let checkBoxAdmin:any = document.getElementById('checkboxAdmin');
      
    let newMemberAdmin = checkBoxAdmin.checked;
    const idNewMember=userdata2.id;
    
    let data : Object = {
      userId:idNewMember,
      groupId:this.currentGroupId,
      isAdmin:newMemberAdmin
    }
    //this.socket.emit('usuario-nuevo',data);
    this.socket.socket.emit('usuario-nuevo',data,cb=>{    
      console.log('callback: ',cb);
      console.log('miembros: ',this.currentMembers);
      this.currentMembers.push(cb);
    });
    alert("Se añadió un nuevo miembro al grupo");
    this.createComponent(1);  
  }
  addUser(){      
      const userdata2 = this.copy(this.userData);    
      var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
      checkBoxAdmin.disabled=false;
      if(checkBoxAdmin.checked){        
        this.NewGroupAdmins.push(userdata2.id);
      }
      
      var userAlreadyRegistered=false;
      for(let element of this.miembros){
        if(userdata2.id==element.id){
          userAlreadyRegistered=true;
        }
      }
      /*this.miembros.forEach(element => {
        if(userdata2.id==element.id){
          userAlreadyRegistered=true;
        }
      });*/
      
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
  deleteMember(memberInformation:any){
    /*NOTA: TENER CUIDADO AL MANDAR DATOS, MONGODB ES SENSIBLE A STRINGS E INTS */
    let userId = memberInformation.value.id;
    let groupId = this.currentGroupId.toString();

    for (let index = 0; index < this.currentMembers.length; index++) {
      const member = this.currentMembers[index];
      if(member.id === userId){
        this.currentMembers.splice(index,1);
      }
    }
    userId = userId.toString();
    this.socket.emit('salir-grupo',{userId,groupId,expulsado:true});
      
  }
  makeAdmin(memberInformation:any){
    let userId = memberInformation.value.id;
    let groupId = this.currentGroupId;   
    
    this.socket.emit('admin-nuevo',{userId,groupId});
  }
  deleteAdmin(memberInformation:any){    
    let userId = memberInformation.value.id;
    let groupId = this.currentGroupId;   

    this.socket.emit('quitar-admin',{userId,groupId});
  }

  isIntegrantAdmin(memberId:number){
    let admins : Array<string>;    
          
    for (let index = 0; index < this.grupos.length; index++) {
      const element = this.grupos[index];
      if(element.id === this.currentGroupId){
        admins = element.miembrosDelGrupo.admin;
      }
    }
    
    if(admins.includes(memberId.toString())){
      return true;
    }
    
    return false;
  }

  async showGroup(groupInformation:any){    
    
    this.currentMembers=[]; 

    this.currentGroup=groupInformation.informacion.nombre;   
    this.currentDescription=groupInformation.informacion.descripcion;
    this.currentGroupId=groupInformation.id;
    this.currentGroupItems=groupInformation.miembrosDelGrupo.integrantes; 
    //--------------------------------------------------------------------------REVISAR -------------------------------------------------------------------------------------------------------------------------
    this.currentGroupItems.forEach(element => {
        this.http.post(`http://localhost:3000/usuarios/${element}`,{}).subscribe(data =>{

        let userData2 = JSON.stringify(data);
 
        let userData2_ = JSON.parse(userData2);
        this.currentMembers.push(userData2_);   
      }); 
    });
    //if(this.chatGroupComponent){
      let mensaje;
      await this.http.post('http://localhost:3000/getGroupMessages',{id:this.currentGroupId}).toPromise().then(data =>{                
        mensaje = data;
      });
      this.chatGroupComponent.updateGroupMessages({idGrupo:this.currentGroupId,mensajes:mensaje});
    
    //this.chatGroupComponent.metodoCualquiera();

    this.createComponent(4);    
     
  }
  exitGroup():void{
    let userId = this.currentUser;
    let groupId = this.currentGroupId;
    this.socket.emit('salir-grupo',{userId,groupId,expulsado:false})
  }

  replaceItem(itemId:string, actionButton : string, info:string):void{
    let originalNameElement : HTMLElement = document.getElementById(itemId);    
    let button : HTMLElement = document.getElementById(actionButton);
    
    const confirmButton : HTMLButtonElement = document.createElement('button');
    const newNameInput = document.createElement('input');    
    newNameInput.type='text';
    newNameInput.value = originalNameElement.innerHTML;
    newNameInput.style.marginLeft = "10px";
    
    confirmButton.innerHTML = "Confirmar";

    let actualGroupName = originalNameElement.innerText;

    originalNameElement.parentElement.replaceChild(newNameInput,originalNameElement);
    button.parentElement.replaceChild(confirmButton,button);

    confirmButton.onclick = ()=>{
      let newName = newNameInput.value;      
      if(actualGroupName.trim() === newName.trim() || actualGroupName === newName){
        alert('Sin cambios');        
      }else{
        let data = {
          idGroup : this.currentGroupId.toString(),
          campo : info,
          nuevoCampo : newName
        }
        this.socket.emit('group-info-change',data);
        originalNameElement.innerHTML = newName;
      }
      
      newNameInput.parentElement.replaceChild(originalNameElement,newNameInput);
      confirmButton.parentElement.replaceChild(button,confirmButton);
      
    }
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