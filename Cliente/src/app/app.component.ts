import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "proyecto"

  constructor(private webSocketService:WebSocketService){

  }

  ngOnInit(){
    //Escuchar al evento del servidor de Socket.io
    this.webSocketService.listen('testEvent').subscribe((data)=>{
       
    });
  }
}