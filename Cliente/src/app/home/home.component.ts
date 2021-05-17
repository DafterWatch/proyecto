import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mensajes : Array<String> = [];

  constructor(private socket: WebSocketService) { }

  ngOnInit(): void {
    this.socket.listen('nuevoMensaje').subscribe((data:any)=>{
      this.mensajes.push(data);
    });
  } 
  sendMensaje(mensaje:string){
    this.socket.emit('nuevoMensaje',mensaje);    
  } 
  value:string = "";
  
  createComponent(index){
    var chatWindow = document.getElementById('chatContainer');
    var groupWindow = document.getElementById('groupContainer');
    var addMemberWindow = document.getElementById('addMemberContainer');

    if(index==1){
      chatWindow.style.display="flex";
      groupWindow.style.display="none";
      addMemberWindow.style.display="none";
    }
    if(index==2){
      chatWindow.style.display="none";
      groupWindow.style.display="flex";
      addMemberWindow.style.display="none";
    }
    if(index==3){
      chatWindow.style.display="none";
      groupWindow.style.display="none";
      addMemberWindow.style.display="flex";
    }


  }
}
