import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket:any;

  readonly URL = 'localhost:3000';
  constructor() {
    this.socket = io.io(this.URL);
  }  

  listen(eventName: string){
    return new Observable(suscriber=>{
      this.socket.on(eventName, (data)=>{
        suscriber.next(data);
      });
    });
  }

  emit(eventName: string, data:any){
    this.socket.emit(eventName,data);
  }
}
