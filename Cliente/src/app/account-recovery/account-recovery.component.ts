import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router'
import { LoaderService } from '../loader.service';

interface Question {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.scss']
})
export class AccountRecoveryComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router, public loaderService:LoaderService) { }
  recuperationFields : any;
  confirmEnabled : boolean = false;
  currentEmail : string;
  ngOnInit(): void {
  }
  questions: Question[] = [
    {value: 'pregunta1', viewValue: '¿Cuál es su comida favorita?'},
    {value: 'pregunta2', viewValue: '¿Cuál es el segundo nombre de su padre?'},
    {value: 'pregunta3', viewValue: '¿Cuál es el nombre de su primer mascota?'}
  ];

  readonly DIRECCION_SERVER : string = 'https://mean-server1.herokuapp.com';  

  async checkIfMailExist(email : string){
    let answerFields;
    await this.http.post(this.DIRECCION_SERVER+`/isRegistered/${email}`,{}).toPromise().then(data =>{
        answerFields = data;        
    });
    if(answerFields.error){
      alert('Error, la cuenta no está registrada en el sistema');
      return;
    }
    this.recuperationFields = answerFields;
    this.currentEmail = email;
    this.confirmEnabled = true;
    document.getElementById('question-container').style.display="";
  }

  async confirmAnswer(answer : String){    
    
    let securityField : any = document.getElementById('securityField');
    let currentQuestion  = this.questions.filter(x => x.value=== securityField.value)[0].viewValue;    

    if(currentQuestion === this.recuperationFields.pregunta && answer === this.recuperationFields.respuesta){      
      this.http.post(this.DIRECCION_SERVER+`/sendPassword/${this.currentEmail}`,{}).subscribe((res:any)=>{
        let message:HTMLParagraphElement = document.createElement('p');
        message.innerText = `Se ha enviado su contraseña a: ${this.currentEmail}`;
        document.getElementById('question-container').parentElement.append(message);        
        //Revisar si funciona
        setTimeout(()=>{
          this.router.navigate(['/','inicio']);
        },3000);
      });
    }else{
      alert('Uno de los campos es incorrecto');
    }
  }

}
