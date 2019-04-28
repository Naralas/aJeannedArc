import {Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

const USER_ID = "USER_ID";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl : string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) { 
    this.apiUrl = baseUrl;
  }

  login(username: string, password: string): void{
    this.http.post<LoginResultModel>(this.apiUrl + "api/login", {
      username: username,
      password: password
    }).subscribe(r => {
      if(r.userId)
      {
        this.setUserID(r.userId);
        this.router.navigateByUrl('/appointments')
      }
      else
      {
        console.error(r.error);
      }
    });
  }

  register(email: string, username: string, password: string): void{
    this.http.post<LoginResultModel>(this.apiUrl + "api/register", {
      email: email,
      username: username,
      password: password
    }).subscribe(r => {
      if(r.userId)
      {
        this.setUserID(r.userId);
        this.router.navigateByUrl('/appointments')
      }
      else
      {
        console.error(r.error);
      }
    });
  }

  setUserID(userID: string)
  {
    localStorage.setItem(USER_ID, userID);
  }
  
  isLogged()
  {
    return localStorage.getItem(USER_ID) != null;
  }
}

export interface LoginResultModel{
  userId: string;
  error: string;
}
