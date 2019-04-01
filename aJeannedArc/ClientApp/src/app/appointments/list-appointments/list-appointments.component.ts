import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-appointments',
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss']
})
export class ListAppointmentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

interface Appointment {
  title: string,
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
