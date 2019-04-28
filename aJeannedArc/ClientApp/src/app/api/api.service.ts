import {Inject, Injectable, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { Reminder } from '../models/reminder';

const USER_ID = 'USER_ID';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string;

  private userChangeSource = new Subject<string>();
  public userIDChanged = this.userChangeSource.asObservable();

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) {
    this.apiUrl = baseUrl;
  }

  login(username: string, password: string): void {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/User/login', {
      username: username,
      password: password
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        console.error(r.error);
      }
    });
  }

  register(email: string, username: string, password: string): void {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/User/create', {
      email: email,
      username: username,
      password: password
    }).subscribe(r => {
      console.log(r);
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        // console.error(r.error);
      }
    });
  }

  logout() {
    localStorage.removeItem(USER_ID);
    this.userChangeSource.next('');
  }

  setUserID(userID: string) {
    localStorage.setItem(USER_ID, userID);
    this.userChangeSource.next(userID);
  }

  isLogged() {
    return localStorage.getItem(USER_ID) != null;
  }

  getUserAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl + 'api/appointment', {});
  }

  getAppointment(id: number): Observable<Appointment> {
    /*this.http.get<Appointment>(this.apiUrl + 'api/appointment/' + id, {
    }).subscribe(r => {
      if (r.id) {
        return r;
      } else {
        console.error('Not working');
      }
    });
    return null;
    const appointment: Appointment = new Appointment();
    appointment.start = new Date();
    appointment.end = new Date();
    appointment.title = "Salut";
    return appointment;*/
    return this.http.get<Appointment>(this.apiUrl + 'api/appointment/' + id);
  }

  createAppointment(appointment: Appointment) {
    this.http.post<Appointment>(this.apiUrl + 'api/appointment/create', {
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      notes: appointment.notes
    }).subscribe(r => {
      if (r != null) {
        console.log(r.title);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  editAppointment(appointment: Appointment) {
    this.http.post<Appointment>(this.apiUrl + 'api/appointment/update/' + appointment.id, {
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      notes: appointment.notes
    }).subscribe(r => {
      if (r != null) {
        console.log(r.title);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  deleteAppointment(appointment: Appointment) {
    this.http.delete<void>(this.apiUrl + 'api/appointment/delete/' + appointment.id, {
    }).subscribe(r => {
      this.router.navigateByUrl('/events');
    });
  }

  getUserReminders(): Observable<Reminder[]> {
    /*this.http.get<Reminder[]>(this.apiUrl + 'api/reminder', {
    }).subscribe(r => {
      console.log(r);
      if (r.length > 0) {
        console.log("More than 0");
        return r;
      } else {
        console.error('Not working');
      }
    });
    return null;*/
    return this.http.get<Reminder[]>(this.apiUrl + 'api/reminder', {});
  }
  getReminder(id: number): Observable<Reminder> {
    /*this.http.get<Reminder>(this.apiUrl + 'api/events/reminders/' + id, {
    }).subscribe(r => {
      if (r.id) {
        return r;
      } else {
        console.error('Not working');
      }
    });
    return null;*/
    return this.http.get<Reminder>(this.apiUrl + 'api/reminder/' + id, {});
  }

  editReminder(reminder: Reminder) {
    console.log(reminder);
    this.http.post<Reminder>(this.apiUrl + 'api/reminder/update/' + reminder.id, {
      title: reminder.title,
      date: reminder.date,
    }).subscribe(r => {
      console.log(r);
      if (r != null) {
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  createReminder(reminder: Reminder) {
    console.log(reminder);
    this.http.post<Reminder>(this.apiUrl + 'api/reminder/create', {
      title: reminder.title,
      date: reminder.date,
    }).subscribe(r => {
      console.log(r);
      if (r != null) {
        console.log(r.title);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  deleteReminder(reminder: Reminder) {
    this.http.delete<void>(this.apiUrl + 'api/reminder/delete/' + reminder.id, {
    }).subscribe(r => {
        this.router.navigateByUrl('/events');
    });
  }
}



export interface LoginResultModel {
  id: string;
  error: string;
}
