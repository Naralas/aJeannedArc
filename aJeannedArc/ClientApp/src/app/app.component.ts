import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {NavItem} from './nav-item';
import {NavService} from './nav.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  navItems: NavItem[] = [
    {
      displayName: 'Home',
      iconName: 'home',
      route: ''
    },
    {
      displayName: 'Counter',
      iconName: 'local_pizza',
      route: 'counter'
    },
    {
      displayName: 'Fetch data',
      iconName: 'data_usage',
      route: 'fetch-data'
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

  constructor(private navService: NavService) {
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
