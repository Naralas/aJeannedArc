import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { NavItem } from './nav-item';
import { NavService } from './nav.service';
import { ApiService } from './api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  private userIDChanged: Subscription = null;

  @ViewChild('appDrawer') appDrawer: ElementRef;

  baseNavItems: NavItem[] = [
    {
      displayName: 'Home',
      iconName: 'home',
      route: ''
    },

    {
      displayName: 'Events',
      iconName: 'date_range',
      route: 'events',
      children: [
        {
          displayName: 'List',
          iconName: 'list',
          route: 'events'
        },
        {
          displayName: 'Add',
          iconName: 'add',
          route: 'events/create',
          children: [
            {
              displayName: 'Appointment',
              iconName: 'event',
              route: 'events/appointments/create'
            },
            {
              displayName: 'Reminder',
              iconName: 'touch_app',
              route: 'events/reminders/create'
            }
          ]
        }
      ]
    }
  ];

  anonNavItems: NavItem[] = [
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
  ];

  loggedNavItems: NavItem[] = [
    {
      displayName: 'Logout',
      iconName: 'subdirectory_arrow_right',
      route: 'logout'
    },
  ];

  navItems: NavItem[] = [];

  constructor(private navService: NavService, private apiService: ApiService) {
    // at some point we should only push the items from one or another
    // but this is a pain because of the order we want (home then login / logout, etc.)
    this.updateNavItems();
  }

  private updateNavItems() {
    this.navItems = Array.from(this.baseNavItems);
    const copyItems: NavItem[] = !this.apiService.isLogged() ? this.anonNavItems : this.loggedNavItems;
    for (const item of copyItems) {
      this.navItems.splice(1, 0, item);
    }
  }

  // https://medium.com/@enriqueoriol/angular-service-component-communication-4933782af52
  ngOnInit() {
    this.userIDChanged = this.apiService.userIDChanged.subscribe(userID =>
      this.updateNavItems()
    );
  }

  ngOnDestroy() {
    this.userIDChanged.unsubscribe();
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
