import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.scss']
})
export class BuscarUsuarioComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuscarUsuarioComponent>) { }

  ngOnInit(): void {
  }
  buscarUsuario(idUsuario : string) : void{
    alert(idUsuario);
  }
  closeModal(){
    this.dialogRef.close();
  }
}
