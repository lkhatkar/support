import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginComponent implements OnInit {

  public formObject: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formObject = this._formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      pid: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  submitForm() {
    for (const key in this.formObject.controls) {
      this.formObject.controls[key].markAsDirty();
      this.formObject.controls[key].updateValueAndValidity();
    }
    if (this.formObject.invalid) return;

    // console.log(this.formObject.value);
    this.authService.agentLogin(this.formObject.value)
    .subscribe(res => {
        console.log(res);
        if (res.success) {
          sessionStorage.setItem('token', res.access_token);
          this.setCurrentAgent();
          this.router.navigate(['/agent']);
        }
      })
  }

  private setCurrentAgent(){
    const agent = {
      username: this.formObject.get('username')?.value,
      email:this.formObject.get('email')?.value
    }
    sessionStorage.setItem('currentAgent',JSON.stringify(agent));
  }
}
