import {Inject, Injectable, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { Subject } from 'rxjs';
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
    this.http.post<LoginResultModel>(this.apiUrl + 'api/login', {
      username: username,
      password: password
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        // console.error(r.error);
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

  getAppointment(id: number): Appointment {
    /*this.http.get<Appointment>(this.apiUrl + 'api/events/appointments/' + id, {
    }).subscribe(r => {
      if (r.id) {
        return r;
      } else {
        console.error('Not working');
      }
    });
    return null;*/
    const appointment: Appointment = new Appointment();
    appointment.start = new Date();
    appointment.end = new Date();
    appointment.title = "Salut";
    return appointment;
  }

  createAppointment(appointment: Appointment) {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/events/appointments/create', {
      appointment: appointment,
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  editAppointment(appointment: Appointment) {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/events/appointments/' + appointment.id + '/edit', {
      appointment: appointment,
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  getReminder(id: number): Reminder {
    /*this.http.get<Reminder>(this.apiUrl + 'api/events/reminders/' + id, {
    }).subscribe(r => {
      if (r.id) {
        return r;
      } else {
        console.error('Not working');
      }
    });
    return null;*/
    const reminder: Reminder = new Reminder();
    reminder.dateTime = new Date();
    reminder.title = "Salut";
    return reminder;
  }

  editReminder(reminder: Reminder) {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/events/reminders/' + reminder.id + '/edit', {
      reminder: reminder,
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }

  createReminder(reminder: Reminder) {
    this.http.post<LoginResultModel>(this.apiUrl + 'api/events/reminders/create', {
      reminder: reminder,
    }).subscribe(r => {
      if (r.id) {
        this.setUserID(r.id);
        this.router.navigateByUrl('/events');
      } else {
        console.error('Not working');
      }
    });
  }
}

export interface LoginResultModel {
  id: string;
  error: string;
}
