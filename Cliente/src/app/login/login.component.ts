import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socket:WebSocketService) { }

  ngOnInit(): void {
  }
  
  login(id:string):void{
    this.socket.socket.emit('login-nuevo',id,cb=>{
      if(cb){
        //TODO: No pasar a la siguiente página!!
        return;
      }
    });
    sessionStorage.setItem('currentUser',id);    
  }

}
