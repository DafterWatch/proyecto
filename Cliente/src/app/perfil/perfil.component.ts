import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  usuario = "Usuario1";
  informacion = "Aveces respiro";
  correo = "123@gmail.com";
}
