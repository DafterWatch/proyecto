import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UsuarioReportadoComponent } from '../modalesAdmin/usuario-reportado/usuario-reportado.component';
import { InformeReporteComponent } from '../modalesAdmin/informe-reporte/informe-reporte.component';
import { BuscarUsuarioComponent } from '../buscar-usuario/buscar-usuario.component';
import {HttpClient} from '@angular/common/http';

interface ReporteGen{
  _id : string;
  type:number;
  id_reportado : number;
  reporte : string;
  id_reportador : number;
}

type InformacionBloqueo = {
  _id : string;
  type : number;
  id_bloqueado : number;
  reporte : string;
}

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']  
})
export class AdministradorComponent implements OnInit {

  //Cambiar cuando se exporte a heroku
  DIRECCION_SERVER : string = 'http://localhost:3000';  

  constructor(public dialog: MatDialog, public http:HttpClient) { }   

  reportesUsuarios : Array<ReporteGen>;
  reportesGrupos : Array<ReporteGen>;
  usuariosBloqueados : Array<InformacionBloqueo>;
  gruposBloqueados : Array<InformacionBloqueo>;

  descripciones : { [key:string]:string } = {
    principal : `Desde está cuenta podrá revisar reportes hechos hacía grupos e usuarios, más tener acceso a los mensajes
    de los usuarios. Podra decidir si bloquear al usuario, grupo o desbloquear. Está cuenta solo puede ser
    usada por usuarios con nivel de acceso superior al sistema.`,
    reporteUsuario : 'Se muestra la lista de usuarios reportados',
    reporteGrupo : 'Se muestra la lista de grupos reportados',
    usuariosBloqueados : 'Se muestra la lista de usuarios que fueron bloqueados',
    gruposBloqueados : 'Se muestra la lista de grupos que fueron bloqueados'
  }

  menuDeAdmin : { [key: string]: {value:boolean, items : any} } = {

    reporteUsuario : {value : false, items : async () => { 
      this.getReportesUsuario(1).then(lista => this.reportesUsuarios = lista);
    }},

    reporteGrupo : {value : false, items : async ()=>{
      this.getReportesUsuario(2).then(lista => this.reportesGrupos = lista);
    }},    
    usuariosBloqueados : {value : false, items : async ()=>{
      this.getReportesUsuario(3).then(lista => this.usuariosBloqueados = lista);
    }},
    gruposBloqueados : {value : false, items : ()=>{
      this.getReportesUsuario(4).then(lista => this.gruposBloqueados = lista);
    }},
    principal : {value : true, items : ()=>{}}
  }

  descripcion : string = this.descripciones['principal'];

  ngOnInit(): void {
  } 
  
  cambiarMenu(nuevoMenu : string):void{

    for(let llave in this.menuDeAdmin){
      this.menuDeAdmin[llave].value = false;
    }
    this.descripcion = this.descripciones[nuevoMenu];
    this.menuDeAdmin[nuevoMenu].value = true;
    this.menuDeAdmin[nuevoMenu].items();
  }
  abrirReporteUsuario(data : {tipo:number, index:number}){
    let informacionReporte : ReporteGen;    
    if(data.tipo === 1){
      informacionReporte = this.reportesUsuarios[data.index];                    
    }     
    else if(data.tipo===2){
      informacionReporte = this.reportesGrupos[data.index];                  
    }
    const dialogRef  = this.dialog.open(UsuarioReportadoComponent, {
      width: '25%',
      data: {informacionReporte}
    });   

    dialogRef.beforeClosed().subscribe( (lista:string) => {            
      if(lista)
        this.recargarLista(lista);
    });
  }
  
  abrirUsuarioBloqueado(data: {tipo : number, index:number}  ) : void {

    let informacionBloqueo : InformacionBloqueo;

    if(data.tipo === 3){
      informacionBloqueo = this.usuariosBloqueados[data.index];
    }else if(data.tipo === 4){
      informacionBloqueo = this.gruposBloqueados[data.index];
    }

    const dialogRef = this.dialog.open(InformeReporteComponent,{
      width:'25%',
      data:{informacionBloqueo}
    });

    dialogRef.beforeClosed().subscribe( (lista:string) => {         
      if(lista)
        this.recargarLista(lista);
    });
    
  }

  recargarLista(lista : string) : void{
    this.menuDeAdmin[lista].items();
  }

  abrirBuscarUsuario() :void {
    this.dialog.open(BuscarUsuarioComponent,{
      width:'25%'
    });
  }

  async getReportesUsuario(tipoReporte : number) : Promise<any> {

    let listaDeBloqueos : any;
    await this.http.post(this.DIRECCION_SERVER+'/getReportesUsuario',{}).toPromise().then( (bloqueos : any)=>{
      listaDeBloqueos = bloqueos.filter(x=> x.type === tipoReporte);
    });
    return listaDeBloqueos;
  }
  

}
