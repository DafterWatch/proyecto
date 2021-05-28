import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.component.html',
  styleUrls: ['./entregar.component.scss']
})
export class EntregarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  numeroTarea = 1;
  fechaVencimiento = "5/28/2021";
  horaVencimiento = "15:00";
  instruccionesTexto = "Enviar en español";
}
