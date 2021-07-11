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
  ngOnInit(): void {
    // this.cards = document.getElementsByClassName('mobileCard');
    // setInterval(()=>{
    //   this.cards[this.currentCard].style.opacity = 0;
    //   this.currentCard--;    

    //   if(this.currentCard < 0){
    //     this.currentCard=4;      
    //   }
    //   this.cards[this.currentCard].style.opacity = 1;
    // },3000);
  }
  
  desvanecerFicha(){    
    
    console.log(this.currentCard);
  }
  
}
