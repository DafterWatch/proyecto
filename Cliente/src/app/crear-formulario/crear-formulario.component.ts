import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crear-formulario',
  templateUrl: './crear-formulario.component.html',
  styleUrls: ['./crear-formulario.component.scss']
})
export class CrearFormularioComponent implements OnInit {

  formulario: FormGroup;
  constructor(private fb: FormBuilder) { }

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
      empresa: new FormControl(''),
      puesto: new FormControl(''),
      descripcion: new FormControl('')
    });
  
    this.experienciaLaboral.push(trabajo);
  }
  borrarTrabajo(indice: number) {
    this.experienciaLaboral.removeAt(indice);
  }
}
