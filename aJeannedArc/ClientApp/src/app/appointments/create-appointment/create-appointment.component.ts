import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ErrorStateMatcher } from '@angular/material';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {

  createEventForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.createEventForm = this.formBuilder.group({
      title: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      notes: [''],
    }, { validator: this.checkDates });
  }

  checkDates(group: FormGroup) {
    const start = new Date(group.controls.start.value);
    const end = new Date(group.controls.end.value);

    return end > start ? null : { invalidDate: true }
  }

  ngOnInit() {
  }

  onSubmit() {
    const newAppointment: Appointment = new Appointment();
    newAppointment.id = -1;
    newAppointment.title = this.createEventForm.value.title;
    newAppointment.start = this.createEventForm.value.start;
    newAppointment.end = this.createEventForm.value.end;
    newAppointment.notes = this.createEventForm.value.notes;

    this.apiService.createAppointment(newAppointment);
    //this.apiService.login(username, password);
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
