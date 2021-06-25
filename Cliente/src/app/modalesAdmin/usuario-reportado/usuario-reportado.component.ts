import { Component, OnInit,Inject, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-usuario-reportado',
  templateUrl: './usuario-reportado.component.html',
  styleUrls: ['./usuario-reportado.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class UsuarioReportadoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsuarioReportadoComponent>, @Inject(MAT_DIALOG_DATA) public data: {user: string}) { }

  listaMensajes : Array< {[key:string] : string | Date} > = [];

  ngOnInit(): void {
    for(let i=0;i<50;i++){
      this.listaMensajes.push(
        {mensaje:i.toString()+' Palabras random', fecha : new Date(Date.now())}
      )
    }    
  }  

  validarFecha( fecha : Date ) : string {
    if(fecha.toDateString() === new Date(Date.now()).toDateString() ){
      return fecha.getHours() + ":" + fecha.getMinutes();
    }
    return fecha.toDateString();
  }
  
  closeModal(){
    this.dialogRef.close();
  }

}
