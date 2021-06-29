import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-cliente',
  templateUrl: './reportes-cliente.component.html',
  styleUrls: ['./reportes-cliente.component.scss']
})
export class ReportesClienteComponent implements OnInit {

  constructor() { }

  radioContent  = [
    { titulo : 'Mensajes de odio', subtitulo : 'Racismo, sexismo, xenofobia, etc.' },
    {titulo : 'Abuso verbal', subtitulo : 'Acoso, lenguaje ofensivo'},
    { titulo : 'Perfil inapropiado', subtitulo : 'Lleva un nombre, descripción o foto inapropiadas' },
    {titulo : 'Actividad sospechosa', subtitulo : 'Usa la paltaforma con fines indebidos'}
  ]

  ngOnInit(): void {
  }

}
