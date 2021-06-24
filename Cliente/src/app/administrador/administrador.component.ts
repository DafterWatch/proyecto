import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import { UsuarioReportadoComponent } from '../modalesAdmin/usuario-reportado/usuario-reportado.component'

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']  
})
export class AdministradorComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  dialogRef : any = null;

  reportesUsuarios : Array<string> = ['Usuario 1','Usuario 2', 'Usuario 3', 'Usuario 4'];
  reportesGrupos : Array<string> = ['Grupo 1','Grupo 2', 'Grupo 3', 'Grupo 4'];
  usuariosBloqueados : Array<string> = ['Ubloc 1','Ubloc 2', 'Ubloc 3', 'Ubloc 4']; 
  gruposBloqueados : Array<string> = ['Gbloc 1','Gbloc 2', 'Gbloc 3', 'Gbloc 4'];   

  descripciones : { [key:string]:string } = {
    principal : `Desde está cuenta podrá revisar reportes hechos hacía grupos e usuarios, más tener acceso a los mensajes
    de los usuarios. Podra decidir si bloquear al usuario, grupo o desbloquear. Está cuenta solo puede ser
    usada por usuarios con nivel de acceso superior al sistema.`,
    reporteUsuario : 'Se muestra la lista de usuarios reportados',
    reporteGrupo : 'Se muestra la lista de grupos reportados',
    usuariosBloqueados : 'Se muestra la lista de usuarios que fueron bloqueados',
    gruposBloqueados : 'Se muestra la lista de grupos que fueron bloqueados'
  }

  menuDeAdmin : { [key: string]: boolean } = {
    reporteUsuario : false,
    reporteGrupo : false,
    gruposBloqueados : false,
    usuariosBloqueados : false,
    principal : true
  }

  descripcion : string = this.descripciones['principal'];

  ngOnInit(): void {
  } 
  
  cambiarMenu(nuevoMenu : string):void{

    for(let llave in this.menuDeAdmin){
      this.menuDeAdmin[llave] = false;
    }
    this.descripcion = this.descripciones[nuevoMenu];
    this.menuDeAdmin[nuevoMenu] = true;
  }
  abrirReporteUsuario(infoUsuario : string){
    this.dialogRef = this.dialog.open(UsuarioReportadoComponent, {
      width: '50%',
      data: {user: infoUsuario}
    });    
  }

}
