import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogModule} from '@angular/material/dialog';
@Component({
  selector: 'app-crear-formulario',
  templateUrl: './crear-formulario.component.html',
  styleUrls: ['./crear-formulario.component.scss']
})


export class CrearFormularioComponent implements OnInit {

  formulario: FormGroup;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<CrearFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.anadirExperienciaLaboral();
  }
  crearFormulario() {
    this.formulario = this.fb.group({
      experienciaLaboral: this.fb.array([])
    });
  }
  get experienciaLaboral(): FormArray {
    return this.formulario.get('experienciaLaboral') as FormArray;
  }
  anadirExperienciaLaboral() {
    const trabajo = this.fb.group({
        empresa: new FormControl('')
    });
  
    this.experienciaLaboral.push(trabajo);
  }
  borrarTrabajo(indice: number) {
    if(indice>0){      
      this.experienciaLaboral.removeAt(indice);
    }
  }
  
  submit(form) {
    this.dialogRef.close(form);
  }
}
