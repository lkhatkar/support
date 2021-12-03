import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InitializeService } from 'src/app/services/initialize.service';

@Component({
  selector: 'app-add-agents',
  templateUrl: './add-agents.component.html',
  styleUrls: ['./add-agents.component.scss']
})
export class AddAgentsComponent implements OnInit {
  @Output() isAgentAddedEvent = new EventEmitter<any>();
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private initService:InitializeService
    ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.invalid) return;
    this.initService.addAgent(this.validateForm.value)
    .subscribe(res=>{
      if(res.success){
        this.isAgentAddedEvent.emit(res.user);
      }
    })
  }

}
