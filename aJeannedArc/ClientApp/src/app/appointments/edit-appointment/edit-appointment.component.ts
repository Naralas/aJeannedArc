import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css']
})
export class EditAppointmentComponent implements OnInit {

  appointment: Appointment = null;
  editAppointmentForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) {
    this.editAppointmentForm = this.formBuilder.group({
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.appointment = this.apiService.getAppointment(id);
  }

  onSubmit() {
    const editedAppointment: Appointment = new Appointment();
    editedAppointment.id = this.appointment.id;
    editedAppointment.title = this.editAppointmentForm.value.title;
    editedAppointment.start = this.editAppointmentForm.value.start;
    editedAppointment.end = this.editAppointmentForm.value.end;

    this.apiService.editAppointment (editedAppointment);
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
