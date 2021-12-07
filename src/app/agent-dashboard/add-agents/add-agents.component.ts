import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { department } from 'src/app/interface/interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-agents',
  templateUrl: './add-agents.component.html',
  styleUrls: ['./add-agents.component.scss']
})
export class AddAgentsComponent implements OnInit {
  @Input() selectedDepartment = "";
  @Output() isAgentAddedEvent = new EventEmitter<any>();
  validateForm!: FormGroup;
  departments:department[]=[];

  constructor(
    private fb: FormBuilder,
    private authService:AuthService
    ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      department_id: [this.selectedDepartment, [Validators.required]]
    });
    this.authService.getDepartments()
    .subscribe(res=>{
      this.departments = res.departments;
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.invalid) return;
    this.authService.addAgent(this.validateForm.value)
    .subscribe(res=>{
      if(res.success){
        this.isAgentAddedEvent.emit(res.agent);
      }
    })
  }

}
