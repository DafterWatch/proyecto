import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit,Output,EventEmitter,Input,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { Form,Messages,ChatEvent,ChatNotification} from './Messages';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss']
})
export class ChatGroupComponent implements OnInit {

  @ViewChild('div') div: ElementRef;
  constructor(private renderer: Renderer2) { 
        
  }  
  //valuesForm : any = {}

  ngOnInit(): void {          
  
  }
  @Output() openDialogEvent= new EventEmitter();
  abrirDialog(){         
    this.openDialogEvent.emit();
  }

  updateFormAnswers(data : any){
    for(let event of this.eventosChat){
      if(event.type===2){
        let form : any = event;
        if(form.idForm === data.idForm){
          form.valores = data.valores;
          form.cantidadVotos = data.cantVotos;
          break;
        }
      }
    }
  }
  previousVoteCount : number = 0;
  updateFormPercentage(data : any){    
    console.log(data.formInfo);
    
    let multipleAnswer = data.formInfo.multipleAnswer;
    this.previousVoteCount = data.formInfo.cantidadVotos;
    data.formInfo.cantidadVotos +=1; //ver si aún es necesario incrementar
    let voteCuantity = data.formInfo.cantidadVotos;
    let voteValue = 100 / voteCuantity;
    if(multipleAnswer){      
      let internalvoteCuantity = this.previousVoteCount * data.answersInfo.multipleAns.length;      
      voteValue = 100 / (voteCuantity * data.answersInfo.multipleAns.length);

      for(let index = 0;index < data.formInfo.valores.length;index++){

        let valor = data.formInfo.valores[index];
        let m = Math.ceil((valor * internalvoteCuantity)/100);              
        let newValor = m * voteValue;                        
        
        data.formInfo.valores[index] = newValor;

      }      
      
      for(let index = 0; index < data.formInfo.cuestions.length;index++){
        const cuestion = data.formInfo.cuestions[index];
        
        if(data.answersInfo.multipleAns.includes(cuestion)){
          data.formInfo.valores[index] +=voteValue;
          
        }
      }
      

    }else{      
      for(let index = 0;index < data.formInfo.valores.length;index++){

        let valor = data.formInfo.valores[index];
        let m = Math.ceil((valor * this.previousVoteCount)/100);              
        let newValor = m * voteValue;                        
        
        data.formInfo.valores[index] = newValor;

      }      
      
      for(let index = 0; index < data.formInfo.cuestions.length;index++){
        const cuestion = data.formInfo.cuestions[index];
        
        if(cuestion === data.answersInfo.selectedOpction){
          data.formInfo.valores[index] +=voteValue;
          break;
        }
      }

    }
  }

  updateGroupMessages(grupo:any){        
    //Acá también parece que hay que realizar la operación!

    if(grupo.type === 2){

    }

    for(let msg of grupo.mensajes){
      msg.time = new Date(msg.time);
    }
    
    this.currentGroupId=grupo.idGrupo;    
    this.eventosChat=grupo.mensajes;    
  }

  @Input() value : String;
  @Input() currentGroup: String;
  @Input() currentGroupId : number;  
  @Input() currentUser : any;
  @Input() currentGroupProfileP:string;
  @Input() currentPinMessage : string = "";
  @Input() isAdmin:Boolean;
  @Input() habilitado : boolean;
  tamano: number = 10;  
 
  eventosChat : ChatEvent[] = [];

  @Output() myEvent= new EventEmitter();
  _toggleOpened(){
    this.myEvent.emit();
  }
  
  @Output() myEventSendMessage= new EventEmitter<any>();
  sendMensaje(message:String){
    console.log(this.habilitado);
    
    let new_msg:Messages = {
      type: 1,
      user: this.currentUser.id,
      message : message,
      name : this.currentUser.nombre,
      time: new Date(Date.now())
    } 
    if(this.habilitado)   
      this.myEventSendMessage.emit(new_msg);

    /*let chat_window = document.getElementById('chatContainerDiv');
    chat_window.scrollTop = chat_window.scrollHeight;*/
    
  }
  @Output() myEventPinMessage = new EventEmitter<any>();
  pinMessage(message:string){    
    this.currentPinMessage = message;
    this.myEventPinMessage.emit(message);
  }
  @Output() myEventRemovePin = new EventEmitter<any>();
  removePin(){
    this.myEventRemovePin.emit();
  }
  addMessageToList(message:any){
    message.time = new Date(message.time);
    this.eventosChat.push(message);
  }
  //-----------------------------------------------------------------------------------
  numeroOpcion = 0;
  htmlToAdd = "";
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
    }
  
}
