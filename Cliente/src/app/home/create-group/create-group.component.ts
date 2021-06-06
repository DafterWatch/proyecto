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
  cleangroupNameAndDescripction(){
    var groupName:any =document.getElementById('idInputNombreDegrupo');
    var groupDescription:any  = document.getElementById('idDescripcionDeGrupo');
    groupName.value="";
    groupDescription.value="";
  }
  getNombreDeGrupo():HTMLInputElement{
    let groupName =<HTMLInputElement> document.getElementById('idInputNombreDegrupo');
    return groupName;
  }
  getDescripcionDeGrupo():HTMLInputElement{
    let groupDescription =<HTMLInputElement> document.getElementById('idDescripcionDeGrupo'); 
    return groupDescription;
  }
  
}
