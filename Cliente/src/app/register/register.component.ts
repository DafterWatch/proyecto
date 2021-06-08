import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http:HttpClient, private router:Router, private socket:WebSocketService) {

  }

  ngOnInit(): void {
  }
  questions: Question[] = [
    {value: 'pregunta1', viewValue: '¿Cuál es su comida favorita?'},
    {value: 'pregunta2', viewValue: '¿Cuál es el segundo nombre de su padre?'},
    {value: 'pregunta3', viewValue: '¿Cuál es el nombre de su primer mascota?'}
  ];

  registerFields : any = {};

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
      alert('Las contraseñas no coinciden');
      return;
    }

    for(let field in this.registerFields){
      if(this.registerFields[field]===""){
        alert('Tiene que completar los campos');
        return;
      }
    }
    let newUser;
    await this.http.post('http://localhost:3000/crearUser',this.registerFields).toPromise().then((res:any)=>{
      if(res.error){
        alert(res.mensaje);
        return;
      }else{
        alert('Registrado!');                   
        newUser = res.user;
      }      
    });                

    this.socket.emit('login-nuevo',{id: newUser.id,created:true});
    sessionStorage.setItem('currentUser',newUser.id);    
    let userDataSave = JSON.stringify(newUser);
    sessionStorage.setItem('currentUserData',userDataSave);
    this.router.navigate(['/','home']);
  }  

  
}
