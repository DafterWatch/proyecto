import { Component, OnInit,Output,EventEmitter,Input  } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  form : FormGroup;
  constructor(private fb: FormBuilder) { 
    this.form = this.fb.group({
      img: [null],
      filename: ['']
    })
  }

  ngOnInit(): void {
  }
  groupImage = "assets/images/GroupDefaultImage.png";
  public sendImage : any;
  imageFile : any;
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
  seleccionarImagen() : void{
    let inputButton : any = document.getElementById('groupImageInput');
    
    inputButton.onchange = ()=>{
      this.imageFile = inputButton.files[0];
      this.sendImage = inputButton.files[0];
      
      this.form.patchValue({img:this.imageFile});
      this.form.get('img').updateValueAndValidity();

      const reader : FileReader = new FileReader();
      reader.onload = ()=>{
        this.groupImage = reader.result as string;
      }
      reader.readAsDataURL(this.imageFile);
    };
    inputButton.click();
  }  
}
