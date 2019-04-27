import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent } from './home/home.component';
import {CounterComponent } from './counter/counter.component';
import {FetchDataComponent } from './fetch-data/fetch-data.component';
import {CreateAppointmentComponent } from './appointments/create-appointment/create-appointment.component';
import {ListAppointmentsComponent} from './appointments/list-appointments/list-appointments.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'appointments', component: ListAppointmentsComponent},
  { path: 'appointments/create', component: CreateAppointmentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
