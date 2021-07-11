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
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';
  calendarVisible = true;

  calendarWeekends = true;

  calendarEvents: EventInput[] = [
    
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
     
    ],
    eventClick: function(info) {
    alert(info.event.title);
    }
  };
  handleDateClick(arg) {
    console.log('date click! ' + arg.jsEvent)

  }


  ngOnInit(): void {
    
    this.currentUserId = sessionStorage.getItem('currentUser');   

     this.http.post(this.DIRECCION_SERVER+`/usuarios/${this.currentUserId}`,{}).toPromise().then(data =>{
      let aux = JSON.stringify(data);         
      this.currentUser = JSON.parse(aux);

      this.http.post(this.DIRECCION_SERVER+'/gruposId/', this.currentUser.grupos).subscribe(data => {
      let userData = JSON.stringify(data);
      this.grupos = JSON.parse(userData);

  

      this.grupos.forEach(element => {
      
          element.tareas.forEach(element1 => {
            
           console.log(element1);
            var mydate = new Date(element1.endDate.trim());
            var taskName= " Titulo: "+element1.titulo.trim()+"\n Grupo: "+element.informacion.nombre+ "\n Fecha de inicio: "+element1.startDate.trim()+"\n Fecha de cierre: "+new Date(mydate).getFullYear()+"-"+new Date(mydate).getMonth()+"-"+new Date(mydate).getDay();
            this.calendarEvents = this.calendarEvents.concat({ 
              title: taskName,
              start: mydate
              })
            });
       
        });

 
      
  
        this.calendarOptions.events=this.calendarEvents;
      });
    });  
  }
 
  grupos:any;



  @Input()
  hello:(hello:any)=>{alert(hello)};
  @Output()
  onSomething = new EventEmitter<string>();

  currentUserId;
  currentUser;
 

  
}







