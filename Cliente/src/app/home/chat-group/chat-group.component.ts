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
      message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium accumsan aliquet. Quisque vulputate pretium nisl, sed fringilla magna aliquam a. Donec sed tortor urna. Duis ultrices maximus ante, nec vulputate nisi faucibus eu. Nullam turpis metus, pulvinar ut nisi non, tristique pretium augue. Nunc semper magna non neque rhoncus, eu rhoncus nibh porttitor. Curabitur tincidunt aliquam nibh, ac dapibus lectus.

      In eu semper ex. In a metus elementum, sagittis ante eu, consequat ante. Nulla pretium dui quis posuere finibus. Quisque porta quam pulvinar mauris cursus maximus. Mauris nec velit sit amet felis hendrerit eleifend ac id erat. Donec ut fringilla dui. Vivamus eget lobortis lacus. Sed pellentesque ut mi non interdum.
      
      Cras dolor sem, congue et urna quis, faucibus feugiat libero. Etiam nisi augue, luctus eu scelerisque quis, mattis ut urna. Nunc ullamcorper dignissim nibh vitae faucibus. In hendrerit facilisis leo at sagittis. Nam tristique gravida commodo. Vestibulum imperdiet, ligula venenatis pharetra tristique, tortor leo iaculis dolor, et placerat tellus eros id felis. Pellentesque ut placerat risus, eu dictum odio. Quisque porttitor varius nunc, sed vehicula nulla tristique vel. Suspendisse ut vulputate sapien. Phasellus luctus dolor et eleifend rhoncus. Vestibulum a libero at odio iaculis varius in in erat.
      
      Maecenas vitae faucibus urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas lacinia consectetur tellus ornare maximus. Aliquam sodales nibh at molestie tempor. Donec eget justo at elit blandit accumsan. Mauris in sem in lectus gravida tincidunt. Cras ut elit et purus rutrum malesuada. Sed arcu tortor, venenatis non aliquam vitae, lobortis facilisis risus. Maecenas vel scelerisque felis. Cras est justo, molestie ac bibendum non, elementum sed dui. Phasellus semper ac nibh sit amet hendrerit. Sed posuere ultricies venenatis. Cras vel elit mauris. Duis eu sagittis nisi, vitae ullamcorper metus.
      
      Curabitur cursus ornare mattis. Duis at lectus in eros interdum placerat quis eget mauris. Nunc tortor risus, tincidunt sed accumsan a, dictum sit amet ante. Fusce eleifend augue sem, in molestie diam eleifend at. Nulla faucibus sapien et tellus fermentum auctor. Nunc a diam quis mi fringilla fringilla eu ut lectus. Suspendisse sodales purus vel lorem sagittis congue. Sed semper hendrerit dui rutrum aliquam. In at lorem sit amet nunc facilisis dictum tincidunt ut ante.`,
      name:"Pablo"
    },
    {
      user: 2,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 2,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 2,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 2,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
    },
    {
      user: 1,
      message: "aaa",
      name:"Pablo"
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
