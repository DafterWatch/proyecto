import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
import {HttpHeaders} from "@angular/common/http";
import { HttpParams } from '@angular/common/http';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  animations: [trigger('fade', [      
    transition('active => inactive', [
      style({opacity: 0}),
      animate(1000, style({opacity: 1}))
    ])
  ])]
})
export class InicioComponent implements OnInit {

  constructor(private http:HttpClient) { }

  currentCard : number =4;
  cards :any;

  intervalId;

  ngOnInit(): void {
    this.cards = document.getElementsByClassName('mobileCard');
    this.intervalId = setInterval(()=>{
      this.cards[this.currentCard].style.opacity = 0;
      this.currentCard--;    

      if(this.currentCard < 0){
        this.currentCard=4;      
      }
      this.cards[this.currentCard].style.opacity = 1;
    },3000);
  }
  
  stopInvterval(){    
    clearInterval(this.intervalId);    
  }
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';
  downloadAPK(){
    this.http.get(this.DIRECCION_SERVER+'/getInformacionArchivo',{responseType:"json",params:{"idTareaNube":"1VaLNG8E3106PINob8uHdvebATZl0Jzcx"}}).subscribe(
      (res)=>{
        this.http.get(this.DIRECCION_SERVER+'/descargarTarea',{responseType:"blob",params:{"idTareaNube":"1VaLNG8E3106PINob8uHdvebATZl0Jzcx"}}).toPromise()
        .then(blob => {
            saveAs(blob, res); 
        })         
      },
      (err)=>console.log(err)
    );
  }
  downloadManual(){
    this.http.get(this.DIRECCION_SERVER+'/getInformacionArchivo',{responseType:"json",params:{"idTareaNube":"1xdhSjXSduX0RzAok388hWPyM2WaSXbub"}}).subscribe(
      (res)=>{
        this.http.get(this.DIRECCION_SERVER+'/descargarTarea',{responseType:"blob",params:{"idTareaNube":"1xdhSjXSduX0RzAok388hWPyM2WaSXbub"}}).toPromise()
        .then(blob => {
            saveAs(blob, res); 
        })         
      },
      (err)=>console.log(err)
    );
  }
  
}
