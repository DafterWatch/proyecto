import { Component, OnInit, Input } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  constructor(private socket : WebSocketService) { }

  @Input() pregunta : string;
  @Input() preguntas : Array<string>;
  @Input() multipleAnswer : boolean;
  @Input() idForm : number;
  @Input() membersLength : number;
  @Input() values : Array<number>;
  @Input() cantidadVotos : number;  
  @Input() currentUserId : number;
  @iNP
  
  selectedOpction : string;
  multipleOptions : Array <String>
  checks : Array<boolean>;
  //values : Array<number>;  

  ngOnInit(): void {
    var cantPreguntas = this.preguntas.length;
    console.log(cantPreguntas);
    this.checks = Array(this.preguntas.length).fill(false);
    //this.values = Array(this.preguntas.length).fill(0);    
  }
    
  selectOption(index : string){    
    this.selectedOpction = index;            
  }
  sendAnswer(multiple : boolean){
    let info = {
      userId : this.currentUserId,
      idForm : this.idForm,
      selectedOpction : "",
      multipleAns : []
    }
    if(multiple){

      for (let index = 0; index < this.checks.length; index++) {
        const element :boolean = this.checks[index];
        if(element){
          info.multipleAns.push(this.preguntas[index]);
        }
      }

    }else{
      info.selectedOpction = this.selectedOpction;      
    }
    this.socket.emit('respuesta-form',info);
  }
  
}
