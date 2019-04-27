import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {NavItem} from './nav-item';
import {NavService} from './nav.service';
import {ApiService} from './api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  navItems: NavItem[] = [];

  anonNavItems : NavItem[] =
  [
    {
      displayName: 'Home',
      iconName: 'home',
      route: ''
    },

    {
      displayName: 'Login',
      iconName: 'person',
      route: 'login'
    },

    {
      displayName: 'Register',
      iconName: 'person_add',
      route: 'register'
    },

    {
      displayName: 'Appointments',
      iconName: 'date_range',
      route: 'appointments',
      children: [
        {
          displayName: 'List',
          iconName: 'list',
          route: 'appointments'
        },
        {
          displayName: 'Add',
          iconName: 'add',
          route: 'appointments/create',
        }
      ]

    },
  ];

  loggedNavItems : NavItem[] =
  [
    {
      displayName: 'Home',
      iconName: 'home',
      route: ''
    },

    {
      displayName: 'Logout',
      iconName: 'subdirectory_arrow_right',
      route: 'login'
    },

    {
      displayName: 'Appointments',
      iconName: 'date_range',
      route: 'appointments',
      children: [
        {
          displayName: 'List',
          iconName: 'list',
          route: 'appointments'
        },
        {
          displayName: 'Add',
          iconName: 'add',
          route: 'appointments/create',
        }
      ]
    },
  ];

  constructor(private navService: NavService, private apiService: ApiService) {
    // at some point we should only push the items from one or another
    // but this is a pain because of the order we want (home then login / logout, etc.)
    if(!apiService.isLogged())
    {
      this.navItems = this.anonNavItems;
    }
    else
    {
      this.navItems = this.loggedNavItems;
    }
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
