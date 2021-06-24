import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es-us';
import { ClaseMensaje } from './mensaje';
import {HttpClient} from '@angular/common/http';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit,ClaseMensaje {


  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  
  public verMensaje1(){
    alert("sadsad");
  }

  constructor(private http:HttpClient) { }
  mensaje: String="asdsad";

  calendarVisible = true;

  calendarWeekends = true;

  calendarEvents: EventInput[] = [
    { title: 'Event Now', date: new Date() }
  ];

  ngOnInit(): void {
    
    this.currentUserId = sessionStorage.getItem('currentUser');   

     this.http.post(`http://localhost:3000/usuarios/${this.currentUserId}`,{}).toPromise().then(data =>{
      let aux = JSON.stringify(data);         
      this.currentUser = JSON.parse(aux);

      this.http.post('http://localhost:3000/gruposId/', this.currentUser.grupos).subscribe(data => {
      let userData = JSON.stringify(data);
      this.grupos = JSON.parse(userData);

      var tareasGrupos:any[]=[];

      this.grupos.forEach(element => {
        element.tareas.forEach(element1 => {
          tareasGrupos.push(element1);
          });
        });

 
      tareasGrupos.forEach(element => {
        var mydate = new Date(element.endDate.trim());

        var taskName= element.titulo;
        var date1 = (mydate.getFullYear()+"-"+mydate.getMonth()+"-"+mydate.getDay());
        this.calendarEvents = this.calendarEvents.concat({ 
          title: taskName,
          start: date1
        })
      });
      });
    });  
  }
 
  grupos:any;

  handleDateClick(arg) {

  }


  @Input()
  hello:(hello:any)=>{alert(hello)};
  @Output()
  onSomething = new EventEmitter<string>();

  currentUserId;
  currentUser;
 

  
}







