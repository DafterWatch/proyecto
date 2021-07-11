import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';

interface Question {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router, private socket:WebSocketService, public loaderService:LoaderService) {

  }
  incorrectEmail = false;
  validadores:object ={
    "name":false,
    "email":false,
    "securityAns":false,
    "password":false,
    "confirm":false    
  }
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';

  ngOnInit(): void {
  }
  questions: Question[] = [
    {value: 'pregunta1', viewValue: '¿Cuál es su comida favorita?'},
    {value: 'pregunta2', viewValue: '¿Cuál es el segundo nombre de su padre?'},
    {value: 'pregunta3', viewValue: '¿Cuál es el nombre de su primer mascota?'}
  ];

  registerFields : any = {};
  error = { error:false, mensaje : '' };

  async register(){
    let nameField : any = document.getElementById('txtNombre');
    let emailField : any = document.getElementById('email');
    let securityField : any = document.getElementById('cbSecurityQ');
    let securityAns : any = document.getElementById('txtSecurityAns');
    let passwordField : any = document.getElementById('psw');
    let passwordConfirm : any = document.getElementById('psw-repeat');    

    this.registerFields = {
      name : nameField.value,
      email : emailField.value,
      securityQuestion : this.questions.filter(x => x.value=== securityField.value)[0].viewValue,
      securityAns : securityAns.value,
      password : passwordField.value
    }    

    if(this.registerFields.password !== passwordConfirm.value){
      this.validadores['confirm']=true;      
    }else{
      this.validadores['confirm']=false;      
    }

    for(let field in this.registerFields){
      if(this.registerFields[field]==="" ){
        this.validadores[field]=true;        
      }else if(field !='email'){        
        this.validadores[field]=false;        
      }
    }

    let errores = Object.values(this.validadores).includes(true);
    if(errores){
      return;
    }
    
    
    let newUser;
    await this.http.post(this.DIRECCION_SERVER+'/crearUser',this.registerFields).toPromise().then((res:any)=>{
      if(res.error){
        //alert(res.mensaje);
        this.error.error=true;
        this.error.mensaje = res.mensaje;
        return;
      }else{
        //alert('Registrado!');                   
        newUser = res.user;
      }      
    });                

    this.socket.emit('login-nuevo',{id: newUser.id,created:true});
    sessionStorage.setItem('currentUser',newUser.id);    
    let userDataSave = JSON.stringify(newUser);
    sessionStorage.setItem('currentUserData',userDataSave);
    this.router.navigate(['/','home']);
  }

  typeEmail(value : string){
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)){      
      this.validadores['email']=false;
      
    }else{      
      this.validadores['email']=true;      
    }
  }

}
