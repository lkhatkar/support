import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit {
  validateForm!: FormGroup;
  currentIndex: number = 0;
  tabs = [
    {
      name: 'Tab 1',
      component: 'database-cred',
      disabled: false
    },
    {
      name: 'Tab 2',
      component: 'admin-cred',
      disabled: true
    }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      postuser: ['postgres', [Validators.required]],
      password: [null, [Validators.required]],
      pghost: ['localhost', [Validators.required]],
      pgdatabase: [null, [Validators.required]],
      pgport: ['5432', [Validators.required]],
    });
  }
  submitForm(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


  }

}
