import { Component, OnInit, Renderer2, ViewChild, ElementRef} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crear-formulario',
  templateUrl: './crear-formulario.component.html',
  styleUrls: ['./crear-formulario.component.scss']
})
export class CrearFormularioComponent implements OnInit {
  //--------Aqui busca el div llamado '#div' en el html para generar las nuevas opciones------------
  @ViewChild('div') div: ElementRef;
  //--------------------
  //Se utiliza Renderer2 para generar con los appends
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
  }
  numeroOpcion = 0;
  //Con esta función se añaden las opciones
  addElement() {
    this.numeroOpcion++;
    const input: HTMLParagraphElement = this.renderer.createElement('input');
    const p: HTMLParagraphElement = this.renderer.createElement('p');
    const br: HTMLParagraphElement = this.renderer.createElement('br');
    p.innerHTML = "Opcion "+this.numeroOpcion;
    this.renderer.appendChild(this.div.nativeElement, p)
    this.renderer.addClass(input, 'opcionesDiv');
    this.renderer.appendChild(this.div.nativeElement, input)
    this.renderer.appendChild(this.div.nativeElement, br)
  } 
}
