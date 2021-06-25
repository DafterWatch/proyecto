import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-informe-reporte',
  templateUrl: './informe-reporte.component.html',
  styleUrls: ['./informe-reporte.component.scss']
})
export class InformeReporteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InformeReporteComponent>) { }

  ngOnInit(): void {
  }
  closeModal() : void{
    this.dialogRef.close();
  }

}
