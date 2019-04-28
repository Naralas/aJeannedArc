import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ErrorStateMatcher } from '@angular/material';
import { Reminder } from '../../models/reminder';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-reminder',
  templateUrl: './edit-reminder.component.html',
  styleUrls: ['./edit-reminder.component.css']
})
export class EditReminderComponent implements OnInit {

  reminder: Reminder = null;
  editReminderForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) {
    this.editReminderForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
    }, );
  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getReminder(id).subscribe(response => this.reminder = response);
  }

  onSubmit() {
    const editedReminder: Reminder = new Reminder();
    editedReminder.id = this.reminder.id;
    editedReminder.title = this.editReminderForm.value.title;
    editedReminder.date = this.editReminderForm.value.date;

    this.apiService.editReminder(editedReminder);
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

