import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReminderComponent } from './create-reminder.component';

describe('CreateReminderComponent', () => {
  let component: CreateReminderComponent;
  let fixture: ComponentFixture<CreateReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
