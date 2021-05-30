import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';
import Messages from './Messages';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss']
})
export class ChatGroupComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
  }

  //@Input() mensajes : Array<String> = [];
  @Input() value : String;
  @Input() currentGroup: String;
  tamano: number = 10;
  // user=1 es el usuario en session
  // esto hara q dependiendo de q usuario este en session cambie el chat
  // se puede añadir mas cosas como el nombre envio el mensaje, la hora etc
  mensajes : Messages[]= [
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 2,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 2,
      message: "aaa"
    },
    {
      user: 2,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 2,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    },
    {
      user: 1,
      message: "aaa"
    }
  ]
  
  @Output() myEvent= new EventEmitter();
  _toggleOpened(){
    this.myEvent.emit();
  }
  
  @Output() myEventSendMessage= new EventEmitter<String>();
  sendMensaje(message:String){
    this.myEventSendMessage.emit(message);
    
  }
  
}
