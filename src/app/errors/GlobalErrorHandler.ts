import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor() {
    }
    handleError(error:HttpErrorResponse) {
       console.error('An error occurred:', error.message);
       console.error(error.error);
       alert(error.error);
   }
  }
