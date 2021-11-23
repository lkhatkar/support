import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InitializeService } from '../services/initialize.service';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit {
  validateForm!: FormGroup;
  validateForm1!: FormGroup;
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

  constructor(private fb: FormBuilder, private initalizeService: InitializeService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      postuser: ['postgres', [Validators.required]],
      password: [null, [Validators.required]],
      pghost: ['localhost', [Validators.required]],
      pgdatabase: [null, [Validators.required]],
      pgport: ['5432', [Validators.required]],
    });

      this.validateForm1 = this.fb.group({
        Password:[null,[Validators.required]],
        username:[null,[Validators.required]]

      });
  }
  dbCredSubmit(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.valid) {
      this.initalizeService.sendInitialData(this.validateForm.value)
      .subscribe(res=>{
        console.log(res);
        this.tabs[0].disabled = true;
        this.tabs[1].disabled = false;
        this.currentIndex = 1;
      }, error=> {
        console.error(error);
      });
    }
  }
  adminCredSubmit(): void {
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }

  }
  // submitForm(): void {
  //   if (this.validateForm.valid) {
  //     console.log('submit', this.validateForm.value);
  //   }
  // }




    // this.tabs[0].disabled = true;
    // this.tabs[1].disabled = false;
    // this.currentIndex = 1;
  }





