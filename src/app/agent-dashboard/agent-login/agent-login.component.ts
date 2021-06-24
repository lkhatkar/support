import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginComponent implements OnInit {

  public formObject:FormGroup;
  constructor(private _formBuilder:FormBuilder) {
    this.formObject = this._formBuilder.group({
      userName:['',Validators.required],
      email:['',Validators.required],
      pid:['',Validators.required],
      password:['',Validators.required],
    })
  }

  ngOnInit(): void {

  }

  submitForm(){
    for (const key in this.formObject.controls) {
      this.formObject.controls[key].markAsDirty();
      this.formObject.controls[key].updateValueAndValidity();
    }
    if(this.formObject.invalid) return;
  }
}
