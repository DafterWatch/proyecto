import { Component, OnInit,Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: {user: string}) { }

  ngOnInit(): void {
  }
  state = 'collapsed';

  toggle(): void {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}
