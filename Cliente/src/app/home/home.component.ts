import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component,
  ContentChild,
  OnInit,
  QueryList,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import {Router} from '@angular/router';
import {ChatGroupComponent} from '../home/chat-group/chat-group.component';
import { CrearFormularioComponent } from '../crear-formulario/crear-formulario.component';
import {MatDialog} from '@angular/material/dialog';
import { CalenderComponent } from '../calender/calender.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { ListaTareas1Component } from '../lista-tareas1/lista-tareas1.component';
import { ListaTareas2Component } from '../lista-tareas2/lista-tareas2.component';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader.service';
import { CrearComponent } from '../crear/crear.component';
import { EntregarComponent } from '../entregar/entregar.component';
import { CalificarTareaComponent } from '../calificar-tarea/calificar-tarea.component';
import { ReportesClienteComponent } from '../modalesAdmin/reportes-cliente/reportes-cliente.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  currentGroupId:any =0;
  componentRef= null;  
  currentGroupProfileP : string;  
  currentGroupPinnedMessage : string;

  constructor(private socket: WebSocketService, private http:HttpClient, private route:Router,public dialog: MatDialog,  private resolver: ComponentFactoryResolver, public loaderService:LoaderService) {

    this.currentUserId = sessionStorage.getItem('currentUser');        
    this.generateUserData();

    this.router = route;    
    
  }
  @ViewChild('groupContainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  dialogRef : any = null;
  resultadoDormulario:String;

  ////////////////////////////////////////////////////////////
  currentComponent = null;
 
  @ContentChild('template1') template;
  inputs = {
    hello: (arg:any)=>{console.log(arg)},
    something: Function,
  };
  outputs = {
    onSomething: type => alert(type),
  };
  cleanGropsPage(){
    document.getElementById("submenu1").style.display="none";
    document.getElementById("idComponents").style.display="none";
  }
  openGroups(){

    document.getElementById("submenu1").style.display="block";
    document.getElementById("idComponents").style.display="none";
  }
  openCalendar(){
    document.getElementById("submenu1").style.display="none";
    document.getElementById("idComponents").style.display="block";
    this.currentComponent=CalenderComponent;       
  }
  openProfile(){
    document.getElementById("userProfileContainer").style.display="block";
    /*
    document.getElementById("idComponents").style.display="block";
    this.currentComponent=PerfilComponent;*/
    
  }
  /////////////////////////////////////////////////////////////

  openDialog(): void {
    this.dialogRef = this.dialog.open(CrearFormularioComponent, {
      width: '50%',
      data: {user: this.currentUser, groupId : this.currentGroupId, membersList : this.currentGroupItems}
    });    

  }


  async generateUserData() {
    await this.http.post(`http://localhost:3000/usuarios/${this.currentUserId}`,{}).toPromise().then(data =>{
        let aux = JSON.stringify(data);         
        this.currentUser = JSON.parse(aux);
    });    
    this.currentUser.fotoPerfil = `http://localhost:3000/${this.currentUser.fotoPerfil}`;

    this.http.post('http://localhost:3000/gruposId/',this.currentUser.grupos).subscribe(data =>{      
          let userData = JSON.stringify(data);          
          this.grupos = JSON.parse(userData);                                                                     
    });
    
  }

  hclick = false;
  si = false;

  async isCurrentUsesAdmin(){

    await this.http.post(`http://localhost:3000/isAdmin/${this.currentUserId}/${this.currentGroupId}`,{}).toPromise().then((es:boolean) =>{
      this.si = es;
    });
    
  }

  async isAdmin(){   
    
    await this.http.post(`http://localhost:3000/obtenerGrupo/${this.currentGroupId}`,{}).toPromise().then(tareas =>{
      
      this.http.post(`http://localhost:3000/isAdmin/${this.currentUserId}/${this.currentGroupId}`,{}).subscribe(data =>{
        if(data){
          this.entry.clear();
          const factory = this.resolver.resolveComponentFactory(ListaTareas1Component);
          this.componentRef = this.entry.createComponent(factory);
          this.componentRef.instance.tareas = tareas;

          this.componentRef.instance.crearTarea.subscribe(() => {
            this.crearTarea();
          });
          this.componentRef.instance.verTarea.subscribe((id) => {
            this.verTarea(id);
          });
          this.componentRef.instance.cerrarVentana.subscribe(() => {
            this.cerrarListaDeTareas();
          });
          
  
        } else {      
          this.entry.clear();
          const factory = this.resolver.resolveComponentFactory(ListaTareas2Component);
          this.componentRef = this.entry.createComponent(factory);
          this.componentRef.instance.tareas = tareas;
          console.log(tareas);
          this.componentRef.instance.verTarea.subscribe((id) => {
            this.verTarea(id);
          });
          this.componentRef.instance.cerrarVentana.subscribe(() => {
            this.cerrarListaDeTareas();
          });
          
        }
      });
      
    });   


  }

  cerrarListaDeTareas(){
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChatGroupComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.isAdmin = this.si;
    this._toggleOpened();
    this.showGroup(this.actualGroupInformation);

  }
  async verTarea(id){


    this.http.post(`http://localhost:3000/isAdmin/${this.currentUserId}/${this.currentGroupId}`,{}).subscribe(async data =>{
      if(data){

        await this.http.post(`http://localhost:3000/obtenerGrupo/${this.currentGroupId}`,{}).toPromise().then(tareas =>{
          var listaTareas=tareas[0].tareas
          var tareaSeleccionada=[];
          listaTareas.forEach(element => {
            if(element.idTarea==id){
              tareaSeleccionada.push(element);
              
            }                                                        
          });
    
        this.entry.clear();
        const factory = this.resolver.resolveComponentFactory(CalificarTareaComponent); 
        this.componentRef = this.entry.createComponent(factory);
        this.componentRef.instance.tareaSeleccionada = tareaSeleccionada[0];
        this.componentRef.instance.idGrupo = this.currentGroupId;
        this.componentRef.instance.Usuario = this.currentUser;
        this.componentRef.instance.NoEntregadasTareas = tareas[0].miembrosDelGrupo.integrantes.length;

        this.componentRef.instance.abrirListaTareas.subscribe(()=>{
          this.isAdmin();
        });

        
        });  

      } else {      
        await this.http.post(`http://localhost:3000/obtenerGrupo/${this.currentGroupId}`,{}).toPromise().then(tareas =>{
          var listaTareas=tareas[0].tareas
          var tareaSeleccionada=[];
          listaTareas.forEach(element => {
            if(element.idTarea==id){
              tareaSeleccionada.push(element);
              
            }                                                        
          });
    
        this.entry.clear();
        const factory = this.resolver.resolveComponentFactory(EntregarComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.componentRef.instance.tareaSeleccionada = tareaSeleccionada[0];
        this.componentRef.instance.grupo = this.currentGroupId;
        this.componentRef.instance.usuario = this.currentUserId;

        this.componentRef.instance.abrirListaTareas.subscribe(()=>{
          this.isAdmin();
        });
        
        });  
      }
    });



   
  }


  crearTarea(){

    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(CrearComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.asignarTarea.subscribe((informacionTarea) => {
      this.asignarTarea(informacionTarea);
    });
    this.componentRef.instance.cerrarCrearTarea.subscribe(() => {
      this.isAdmin();
    });

  }
  async asignarTarea(informacionTarea){
    
    var titulo:any=informacionTarea.titulo;
    var instrucciones:any=informacionTarea.instrucciones;
    var puntos:any=informacionTarea.puntos;
    var startDate:any=informacionTarea.startDate;
    var endDate:any=informacionTarea.endDate;
    var horaVencimiento:any=informacionTarea.horaVencimiento;
    var esRecordatorio:any=informacionTarea.esRecordatorio;
    await this.http.post(`http://localhost:3000/crearTarea/
    ${this.currentGroupId}/
    ${this.currentGroup}/
    ${titulo}/
    ${instrucciones}/
    ${puntos}/
    ${startDate}/
    ${endDate}/
    ${horaVencimiento}/
    ${esRecordatorio}`,{}).toPromise().then((data:any) => {
      
    });    
    
    this.isAdmin();
  }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      if(true){      
        this.componentRef.instance.addMessageToList(data);
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
        console.log('Datos desc',data);
        if(data.campo === "nombre"){
          this.currentGroup = data.nuevoCampo;
          this.componentRef.instance.currentGroup=data.nuevoCampo;

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
      //alert('Te han quitado privilegios de administrador');
    });
    this.socket.listen('usuario-nuevo').subscribe((data:any)=>{      
      this.grupos.push(data);
    });
    this.socket.listen('nuevo-form').subscribe((data:any)=>{
      if(true){      
        this.componentRef.instance.addMessageToList(data);
      }
    });
    this.socket.listen('respuesta-form').subscribe((data:any)=>{
      if(true){      
        //console.log(data);
        this.componentRef.instance.updateFormAnswers(data);
      }
    });
    this.socket.listen('group-picture-change').subscribe((data:any)=>{
      //console.log(data);
      
      if(data.group == this.currentGroupId){
        this.currentGroupProfileP = data.newProfile;
        this.componentRef.instance.currentGroupProfileP = data.newProfile;
        //Posible error ???
      }
    });
    this.socket.listen('message-pinned').subscribe((data:any)=>{
      if(data.groupId== this.currentGroupId){
        this.componentRef.instance.currentPinMessage = data.message;
      }
    });
    this.socket.listen('remove-pin').subscribe((data:any)=>{
      if(data.groupId== this.currentGroupId){
        this.componentRef.instance.currentPinMessage='';
      }
    });
  } 

  sendMensaje(message:any){         
    this.socket.emit('nuevoMensaje',{idGrupo:this.currentGroupId, mensaje:message});    
  } 

  cleanCreateGroupFields(){
    this.componentRef.instance.cleangroupNameAndDescripction();    
    this.miembros=[];
    this.NewGroupAdmins = [];
  }
  cleanAddMemberFields(){
    this.componentRef.instance.cleanFieldToSearchUser();
    this.userData={}
  }

  value:string = "";
  
  createComponent(index){
    if(index==1){
      this.entry.clear();
      const factory = this.resolver.resolveComponentFactory(ChatGroupComponent);
      this.componentRef = this.entry.createComponent(factory);
      this.componentRef.instance.mensajes = this.mensajes;
      this.componentRef.instance.currentGroupId = this.currentGroupId;
      this.componentRef.instance.currentUser = this.currentUser;
      this.componentRef.instance.currentGroup = this.currentGroup;
      this.componentRef.instance.currentGroupProfileP = this.currentGroupProfileP;
      this.componentRef.instance.currentPinMessage = this.currentGroupPinnedMessage;
      this.componentRef.instance.isAdmin = this.si;

      this.componentRef.instance.openDialogEvent.subscribe(() => {
        this.openDialog();
      });
      this.componentRef.instance.myEvent.subscribe(() => {
        this._toggleOpened();
      });
      this.componentRef.instance.myEventSendMessage.subscribe(($event) => {
        this.sendMensaje($event);
      });
      this.componentRef.instance.myEventPinMessage.subscribe(($event)=>{
        this.pinMessage($event);
      });
      this.componentRef.instance.myEventRemovePin.subscribe(()=>{
        this.removePin();
      }),
      this.NewGroupAdmins = [];      
      this.hclick = false;
    }
    if(index==2){
      this.entry.clear();
      const factory = this.resolver.resolveComponentFactory(CreateGroupComponent);
      console.log(factory);
      this.componentRef = this.entry.createComponent(factory);
      this.componentRef.instance.miembros = this.miembros;
      this.componentRef.instance.myEvent2.subscribe(() => {
        this.createGroup();
      });
      this.componentRef.instance.myEvent.subscribe(($event) => {
        this.createComponent($event);
      });
    }
    if(index==3){
      this.entry.clear();
      const factory = this.resolver.resolveComponentFactory(AddMemberComponent);
      this.componentRef = this.entry.createComponent(factory);
      this.componentRef.instance.userData = this.userData;
      this.componentRef.instance.addUserEvent.subscribe(() => {
        this.addUser();
      });
      this.componentRef.instance.addMemberEvent.subscribe(() => {
        this.addMember();
      });
      this.componentRef.instance.buscarMiembroEvento.subscribe(($event) => {
        this.searchUser($event);
      });
      this.componentRef.instance.myEvent.subscribe(($event) => {
        this.createComponent($event);
      });
      this.componentRef.instance.enableCheckAdmin();
      //---------------------------------------------
      //this.cleanAddMemberFields();

    }
  }
  pinMessage(message:string){
    let data = {
      message,
      idGroup: this.currentGroupId,
      groupIntegrants : this.currentGroupItems
    }
    this.socket.emit('message-pinned',data);
  }  
  removePin(){
    this.socket.emit('remove-pin',{groupId:this.currentGroupId,members:this.currentGroupItems});
  }

  async createGroup(){

    let groupName =this.componentRef.instance.getNombreDeGrupo();
    let groupDescription =this.componentRef.instance.getDescripcionDeGrupo(); 
    let profilePicture = this.componentRef.instance.sendImage;

    const formData : FormData = new FormData;
    formData.append('groupPicture',profilePicture);
    if(this.miembros && Object.keys(this.miembros).length===0 && this.miembros.constructor===Object){
      alert('No se han seleccionado miembros')
      return;
    } 

    let profileData : string;

    await this.http.post('http://localhost:3000/prepareGroupProfile',formData,{responseType:'text'}).toPromise().then(
      (res)=>{
        profileData = res;
      },
      (err)=> (err)?console.log(err):''  
    );

    let integrantesGrupo=[];
    for (let miembro of this.miembros) {
          integrantesGrupo.push(miembro.id)
    }
    integrantesGrupo.push(this.currentUserId);

    let informacionDelGrupo1={
      nombre: groupName.value,
      descripcion:groupDescription.value,
      foto:profileData,
      estado:false      
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
    
    let grupo_n = {id:idGroup, miembrosDelGrupo:miembrosDelGrupo,informacion:informacionDelGrupo1,mensaje:mensaje,mensajeFijado:''}    
    let data = {
      ids: integrantesGrupo,
      infoGrupo:grupo_n
    }
    
    this.socket.socket.emit('nuevoGrupo',data,cb=>{
      if(cb.err){
        console.log(cb.error);        
      }
    });
    this.router.navigate(['/home']);
    window.location.reload();
    //this.cleanGropsPage();    
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
 
    
  }
  async addUser(){  
    console.log('User data', this.userData);
    
    const userdata2 = await this.copy(this.userData);   
    console.log('User data copy',userdata2);
    
    if(this.esAñadirMiembrosAGrupoNuevo){
       
      var checkBoxAdmin:any =this.componentRef.instance.getCheckAdmin(); 
      this.componentRef.instance.enableCheckAdmin(); 
      if(checkBoxAdmin.checked){        
        this.NewGroupAdmins.push(userdata2.id);
      }  
      var userAlreadyRegistered=false;
      for(let element of this.miembros){
        if(userdata2.id==element.id){
          userAlreadyRegistered=true;
        }
      }

      if(!userAlreadyRegistered){
        this.miembros[this.miembroscount]=userdata2;
        this.miembroscount++;
      
        this.createComponent(2);  
      }
      else{
        alert("¡¡Usuario ya registrado!!");
        this.createComponent(3);  
      }
    }
    else{      
      let checkBoxAdmin:any = this.componentRef.instance.getCheckAdmin(); 
        
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
      
  }
esAñadirMiembrosAGrupoNuevo=false;
  addMemberCommon(){
    this.esAñadirMiembrosAGrupoNuevo=true;
    this.createComponent(2);
    this.cleanCreateGroupFields();
  }
  addMemberToGroup(){  
    this.esAñadirMiembrosAGrupoNuevo=false;
    this.createComponent(3);
  }
  searchUser(id:any){
      this.userData.id = id;
      this.http.post(`http://localhost:3000/usuarios/${id}`,{}).subscribe(data =>{
      let userData = JSON.stringify(data);
      let userData_ = JSON.parse(userData);            
      
      this.userData.name = userData_.nombre;      
      this.userData.description = userData_.descripcion;
      this.userData.fotoPerfil = userData_.fotoPerfil;
      this.userData.email = userData_.email;
    
      this.createComponent(3);
      
    });    
  }


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

  actualGroupInformation:any;
  async showGroup(groupInformation:any){    
    
  
    this.actualGroupInformation=groupInformation;
    this.currentMembers=[]; 

    this.currentGroup=groupInformation.informacion.nombre;   
    this.currentDescription=groupInformation.informacion.descripcion;
    this.currentGroupId=groupInformation.id;
    this.currentGroupItems=groupInformation.miembrosDelGrupo.integrantes; 
    this.currentGroupProfileP = 'http://localhost:3000/'+ groupInformation.informacion.foto;
    this.currentGroupPinnedMessage = groupInformation.mensajeFijado;
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
      this.createComponent(1);  
      this.componentRef.instance.updateGroupMessages({idGrupo:this.currentGroupId,mensajes:mensaje});
      this.isCurrentUsesAdmin();
    //this.chatGroupComponent.metodoCualquiera();

      
     
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
        //alert('Sin cambios');        
      }else{
        let data = {
          idGroup : this.currentGroupId.toString(),
          campo : info,
          nuevoCampo : newName
        }
        this.socket.emit('group-info-change',data);
        originalNameElement.innerHTML = newName;
        if(info==='nombre')
          this.componentRef.instance.currentGroup = newName;
      }
      
      newNameInput.parentElement.replaceChild(originalNameElement,newNameInput);
      confirmButton.parentElement.replaceChild(button,confirmButton);
      
    }
  }

  changeProfilePicture(){
    let inputEl : any = document.getElementById('btnDiscretFile');    
    
    const formData : FormData = new FormData;    

    inputEl.onchange = (e)=>{
      formData.append('profileImage',inputEl.files[0]);     
      formData.append('id',this.currentUserId); 
      formData.append('previousImage',this.currentUser.fotoPerfil);
      this.http.post('http://localhost:3000/changeImage',formData,{responseType: 'text'}).subscribe(
        (res)=>{
          console.log(res);          
          this.currentUser.fotoPerfil = res; 
        },
        (err)=>console.log(err)
      );
    };
    inputEl.click();


  }
  changeGroupPicture(){
    let input : any = document.getElementById('btnDiscretFileGroup');
    const formData : FormData = new FormData();

    input.onchange = async ()=>{
      formData.append('groupPicture',input.files[0]);
      formData.append('groupId',this.currentGroupId);
      let newProfileDirection:string;
      await this.http.post('http://localhost:3000/changeGroupImage',formData,{responseType:'text'}).toPromise().then(
        (res)=>{
          console.log(res);          
          newProfileDirection = res;          
        },
        (err)=> (err)?console.log(err):''       
      );         
      
      let data = {
        groupid: this.currentGroupId,
        newProfileDir : newProfileDirection,
        integrantesG :  this.currentGroupItems
      }
      this.socket.emit('group-picture-change',data);
    };
    input.click();
  }
  
  replaceItemProfileInfo(itemId:string,actionButton:string,info:string){
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
          id : this.currentUser.id,
          field : info,
          newField : newName
        }
        this.http.post('http://localhost:3000/changeInfo',data).subscribe((err)=>{
          if(err) console.log(err);
        });
        originalNameElement.innerHTML = newName;
      }
      
      newNameInput.parentElement.replaceChild(originalNameElement,newNameInput);
      confirmButton.parentElement.replaceChild(button,confirmButton);
      
    }
  }
  abrirReporte(tipo : number){
    if(tipo===1){
      this.dialog.open(ReportesClienteComponent);
    }else{
      
    }
  }

  closeSession(){
    this.router.navigate(['/','inicio']);
    this.socket.emit('cerrar-sesion',this.currentUserId);
  }
  
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