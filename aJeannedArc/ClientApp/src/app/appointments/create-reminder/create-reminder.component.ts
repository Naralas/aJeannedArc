import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ErrorStateMatcher } from '@angular/material';
import { Reminder } from '../../models/reminder';


@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html',
  styleUrls: ['./create-reminder.component.scss']
})
export class CreateReminderComponent implements OnInit {

  createReminderForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.createReminderForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
    }, );
  }


  ngOnInit() {
  }

  onSubmit() {
    const newReminder: Reminder = new Reminder();
    newReminder.title = this.createReminderForm.value.title;
    newReminder.date = this.createReminderForm.value.date;

    this.apiService.createReminder(newReminder);
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
