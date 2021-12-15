import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private modalService:ModalService) { }

    handleError(error:any) {
        if (!(error instanceof HttpErrorResponse)) {
          error = error.rejection; // get the error object
        }
        this.modalService.openErrorModal({
          message: error.message || 'Unknown Error!',
          status: error.status || 0
        });
      }
  }
