import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() myEvent= new EventEmitter<string>();
  executeEvent(message){
    this.myEvent.emit(message);
  }

  @Input() userData ={
    name: "",
    id: "",
    description : "",
    profile_picture : ""
  }

}
