import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.userData.fotoPerfil = (this.userData.fotoPerfil)? 'http://localhost:3000/'+this.userData.fotoPerfil: '';
  }

  @Output() myEvent= new EventEmitter<string>();
  executeEvent(message){
    this.myEvent.emit(message);
  }

  @Input() userData : any ={   
  }

  @Output() buscarMiembroEvento= new EventEmitter<string>();
  buscarMiembro(message){
    this.buscarMiembroEvento.emit(message);
  }
  @Output() addUserEvent= new EventEmitter();
  addUser(){
    this.addUserEvent.emit();
  }
  @Output() addMemberEvent= new EventEmitter();
  addMember(){
    this.addMemberEvent.emit();
  }
  cleanFieldToSearchUser(){
    var searchUser:any =document.getElementById('fieldToSearchUser');
    searchUser.value="";
  }
  enableCheckAdmin(){
    var checkBoxAdmin:any = document.getElementById('checkboxAdmin');    
  }
  getCheckAdmin():any{
    var checkBoxAdmin:any = document.getElementById('checkboxAdmin');
    return checkBoxAdmin;
  }
  disableAddMemberToGroupButton(){
    var addMemberToGroup = document.getElementById('addMemberToGroup');
    var addMemberButton = document.getElementById('addMemberButton');
    addMemberToGroup.style.display="none";
    addMemberButton.style.display="flex";
  }
  getAddMemberButton(){
    var addMemberToGroup = document.getElementById('addMemberToGroup');
    var addMemberButton = document.getElementById('addMemberButton');
    addMemberToGroup.style.display="flex";
    addMemberButton.style.display="none";
  }

}
