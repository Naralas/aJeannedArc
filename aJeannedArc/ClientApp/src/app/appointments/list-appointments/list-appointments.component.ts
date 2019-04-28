import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { Reminder } from '../../models/reminder';
import { ApiService } from '../../api/api.service';
import { Appointment } from '../../models/appointment';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

const eventColors: any = {
  appointment: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  reminder : {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
};

@Component({
  selector: 'app-list-appointments',
  templateUrl: './list-appointments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./list-appointments.component.scss'],
  providers:  [ ApiService ]
})
export class ListAppointmentsComponent implements OnInit {

  constructor(private modal: NgbModal, private apiService: ApiService, private cdRef: ChangeDetectorRef) {
  }


  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  reminders: Reminder[] = [];
  appointments: Appointment[] = [];

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  ngOnInit(): void {
    this.populateReminders();
    this.populateAppointments();
  }

  populateAppointments() {
    this.apiService.getUserAppointments().subscribe(response => {
      for (const appointment of response) {
        this.events = [
          ...this.events,
        {
          id: appointment.id,
          start: new Date(appointment.start),
          end: new Date(appointment.end),
          title: appointment.title,
          color: eventColors.appointment,
          actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
        }
      ]
    }

    this.appointments = response;
    this.cdRef.detectChanges(); // <== added
    })
  }

  populateReminders() {
    this.apiService.getUserReminders().subscribe(response => {
        for (const reminder of response) {
          this.events = [
            ...this.events,
          {
            id: reminder.id,
            start: new Date(reminder.date),
            end: new Date(reminder.date),
            title: reminder.title,
            color: eventColors.reminder,
            actions: this.actions,
            allDay: true,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
          }
        ]
      }

      this.reminders = response;
      this.cdRef.detectChanges(); // <== added
    });

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if(action === 'Clicked') {
     return;
    }
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteAppointment(appointment: Appointment)
  {
    this.appointments.splice(this.appointments.indexOf(appointment), 1);
    this.events.splice(this.events.indexOf(
      this.events.filter(event => event.id === appointment.id && event.color === eventColors.appointments)[0]), 1);
    this.apiService.deleteAppointment(appointment);
    this.cdRef.detectChanges();
  }

  deleteReminder(reminder: Reminder)
  {
    console.log(this.events.length);
    this.reminders.splice(this.reminders.indexOf(reminder), 1);
    this.events.splice(this.events.indexOf(
      this.events.filter(event => event.id === reminder.id && event.color === eventColors.reminders)[0]), 1);
    this.apiService.deleteReminder(reminder);
    this.cdRef.detectChanges();
    console.log(this.events.length);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}





