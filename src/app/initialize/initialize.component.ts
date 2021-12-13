import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InitializeService } from '../services/initialize.service';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit {
  dbCredForm!: FormGroup;
  adminCredForm!: FormGroup;
  currentIndex: number = 0;
  tabs = [
    {
      name: 'Database Credentials',
      component: 'database-cred',
      disabled: false
    },
    {
      name: 'Admin Credentials',
      component: 'admin-cred',
      disabled: true
    }
  ];

  constructor(
    private fb: FormBuilder,
    private initalizeService: InitializeService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.dbCredForm = this.fb.group({
      postuser: ['postgres', [Validators.required]],
      password: [null, [Validators.required]],
      pghost: ['localhost', [Validators.required]],
      pgdatabase: [null, [Validators.required]],
      pgport: ['5432', [Validators.required]],
    });

    this.adminCredForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      department:['Default']
    });
  }
  dbCredSubmit(): void {
    for (const i in this.dbCredForm.controls) {
      this.dbCredForm.controls[i].markAsDirty();
      this.dbCredForm.controls[i].updateValueAndValidity();
    }
    if (this.dbCredForm.valid) {
      this.initalizeService.sendInitialData(this.dbCredForm.value)
        .subscribe(res => {
          console.log(res);
          this.tabs[0].disabled = true;
          this.tabs[1].disabled = false;
          this.currentIndex = 1;
        }, error => {
          console.error(error);
        });
    }
  }
  adminCredSubmit(): void {
    for (const i in this.adminCredForm.controls) {
      this.adminCredForm.controls[i].markAsDirty();
      this.adminCredForm.controls[i].updateValueAndValidity();
    }
    if(this.adminCredForm.valid){
      this.initalizeService.addAgent(this.adminCredForm.value)
      .subscribe(res=>{
        if(res){
          console.log(res);
          this.router.navigate(['/agent']);
        }
      })
    }
  }
}
