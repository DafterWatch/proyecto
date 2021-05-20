import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() myEvent= new EventEmitter<string>();
  executeEvent(message){
    this.myEvent.emit(message);
  }

  @Input() miembros : Object = {};

  @Output() myEvent2= new EventEmitter();
  createGroup(){
    this.myEvent2.emit();
  }
  
}
