import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpResponse } from '@angular/common/http';
import {  retry, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector, private auth_service: AuthService, private router: Router) { }
  intercept(req:any, next:any) {
    let authService = this.injector.get(AuthService);
    //console.log(configService.getToken());
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.acquireToken()}`
      }
    });
    return next.handle(tokenizedReq)//.pipe(
    //   retry(2),
    //   catchError((error: HttpErrorResponse)=> {
    //     //console.log('Http Error '+ error);
    //     authService.logout();
    //     return throwError(error);
    //   })

    // );
   }
  }
