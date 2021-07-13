import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';


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

  constructor() { }

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
  download(name : string){

    

    let downloads = {
      'web_manual' : 0,
      'mov_manual' : 1,
      'apk': 2
    }

  }
  
}
