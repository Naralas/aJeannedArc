import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent } from './home/home.component';
import {CreateAppointmentComponent } from './appointments/create-appointment/create-appointment.component';
import {ListAppointmentsComponent} from './appointments/list-appointments/list-appointments.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { CreateReminderComponent } from './appointments/create-reminder/create-reminder.component';
import { EditReminderComponent } from './appointments/edit-reminder/edit-reminder.component';
import { EditAppointmentComponent } from './appointments/edit-appointment/edit-appointment.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'events', component: ListAppointmentsComponent},
  { path: 'events/reminders/create', component: CreateReminderComponent},
  { path: 'events/appointments/create', component: CreateAppointmentComponent },
  { path: 'events/reminders/:id/edit', component: EditReminderComponent },
  { path: 'events/appointments/:id/edit', component: EditAppointmentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
