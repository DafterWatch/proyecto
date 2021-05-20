import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss']
})
export class ChatGroupComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
  }

  @Input() mensajes : Array<String> = [];
  @Input() value : String;
  @Input() currentGroup: String;
  
  @Output() myEvent= new EventEmitter();
  _toggleOpened(){
    this.myEvent.emit();
  }
  @Output() myEventSendMessage= new EventEmitter<String>();
  sendMensaje(message:String){
    this.myEventSendMessage.emit(message);
    
  }
  
}
