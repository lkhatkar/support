import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Error } from 'src/app/interface/interface';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss']
})
export class ErrorHandlerComponent implements OnInit {

  isErrorVisible = false;
  error: Error = {
    status: 'error',
    title: 'Unknown Error Occured!'
  };
  constructor(
    private modalService: ModalService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.modalService.getErrorStatus()
      .subscribe(err => {
        this.setErrorStatus(err);
        this.showModal();
        setTimeout(() => {
          this.hideModal();
        }, 5000);
      })
  }

  setErrorStatus(error:any) {
    switch (error.status) {
      case 0: {
        this.error.status = '500';
        this.error.title = "Internal Server Error!"
        break;
      }
      case 403: {
        this.error.status = '403';
        this.error.title = "Sorry, you are not authorized to access this page."
        break;
      }
      case 404: {
        this.error.status = '404';
        this.error.title = "Sorry, the page you visited does not exist."
        break;
      }
      case 500: {
        this.error.status = '500';
        this.error.title = "Internal Server Error!"
        break;
      }
      default: {
        this.error.status = 'error';
        this.error.title = error.message
        break;
      }
    }
  }

  showModal(): void {
    this.isErrorVisible = true;
    this.ref.detectChanges();
  }

  hideModal(): void {
    this.isErrorVisible = false;
    this.ref.detectChanges();
  }

}
