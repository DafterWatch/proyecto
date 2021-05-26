import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es-us';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  locales = [esLocale];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: esLocale,
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: 'Tarea 1', date: '2021-05-01' },
      { title: 'Tarea 2', date: '2021-05-01' },
      { title: 'Recordatorio 1', date: '2021-05-11' },
      { title: 'Tarea 3', date: '2021-05-16' }
    ]
  };
  handleDateClick(arg) {
    console.log('fecha ' + arg.dateStr);
  }
}
