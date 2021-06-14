import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socket:WebSocketService, private router:Router, public loaderService:LoaderService) { }

  ngOnInit(): void {
  }
  
  emailCompleted:boolean = true;
  passwordCompleted:boolean = true;

  async login(id:string, password:string):Promise<any>{    
    let callbackData;

    if(["1","2","3"].includes(id)){
      this.socket.emit('login-nuevo',{id,test:true});
      sessionStorage.setItem('currentUser',id);    
      this.router.navigate(['/','home']);
      return;
    }

    await this.getLoginData(id,password).then(data=>{
      callbackData = data;
    });
    if(!callbackData.error){
      sessionStorage.setItem('currentUser',callbackData.user.id);  
      let userDataSave = JSON.stringify(callbackData.user);
      sessionStorage.setItem('currentUserData',userDataSave);
      console.log(callbackData.user);      
      this.router.navigate(['/','home']);
    }else{
      alert(callbackData.mensaje);
    }
  }
  async getLoginData(id:string, password:string){
    return new Promise(resolve =>{
      this.socket.socket.emit('login-nuevo',{id,password,test:false},callbackData=>{
        resolve(callbackData);
    });
  });
  }
}