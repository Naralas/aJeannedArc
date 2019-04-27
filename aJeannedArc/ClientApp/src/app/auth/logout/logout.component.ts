import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    console.log("logout");
    this.apiService.logout();
    this.router.navigateByUrl('/');
  }

}
