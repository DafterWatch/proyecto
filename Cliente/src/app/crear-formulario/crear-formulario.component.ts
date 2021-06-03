import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Renderer2, ViewChild, ElementRef,EventEmitter, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  constructor(private renderer: Renderer2, @Inject(MAT_DIALOG_DATA) public dataFromParent: any) { }    
  
  ngOnInit(): void {
    
  }
  
  sendForm(pregunta : string, multipleAnswer: boolean) : void {     
    let preguntas : Array<string> = [];    
                
    let cuestionInputs = document.getElementsByClassName('cuestion_input');
    for (let index = 0; index < cuestionInputs.length; index++) {
      const element : any = cuestionInputs[index];      
      preguntas.push(element.value);
    }             
    let fields = {
      cuestions : preguntas,
      cuestion : pregunta,
      multipleAnswer
    }
    this.dataFromParent(fields);
  }
  numeroOpcion = 0;
  //Con esta función se añaden las opciones
  addElement() {
    if(this.numeroOpcion>5){
      return;
    }
    this.numeroOpcion++;
    const container : HTMLDivElement = this.renderer.createElement('div');
    container.className = "cuestion_box";
    const input : HTMLInputElement = this.renderer.createElement('input');    
    input.className = "cuestion_input";
    input.value = "Opción "+this.numeroOpcion;

    container.append(input);
    

    if(this.numeroOpcion > 1){
      const deleteButton : HTMLButtonElement = this.renderer.createElement('button');      
      deleteButton.innerText = "Borrar";      
      deleteButton.onclick = ()=>{        
        container.parentElement.removeChild(container);
        this.numeroOpcion--;
      };
      container.append(deleteButton);                
    }
    this.renderer.appendChild(this.div.nativeElement, container);
    /*
    const input: HTMLParagraphElement = this.renderer.createElement('input');
    const p: HTMLParagraphElement = this.renderer.createElement('p');
    const br: HTMLParagraphElement = this.renderer.createElement('br');
    p.innerHTML = "Opcion "+this.numeroOpcion;    
    this.renderer.appendChild(this.div.nativeElement, p);
    this.renderer.addClass(input, 'opcionesDiv');
    this.renderer.appendChild(this.div.nativeElement, input);
    this.renderer.appendChild(this.div.nativeElement, br);*/
  } 
}
