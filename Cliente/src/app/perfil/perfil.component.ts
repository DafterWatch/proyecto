import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor() { }
  userData : any;
  ngOnInit(): void {
    this.userData = sessionStorage.getItem('currentUserData');   
    this.userData = JSON.parse(this.userData);
    this.usuario= this.userData.nombre;
    this.informacion = this.userData.descripcion;
    this.correo = this.userData.email; 
  }
  usuario = "";
  informacion = "";
  correo = "";

  mostrar(){
    console.log(this.hello);
  }
  @Input()
  hello: string;
  @Input()
  something: Function;
  @Output()
  onSomething = new EventEmitter<string>();
}
