import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { InitializeService } from '../services/initialize.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivate {
  constructor
  (
    private initializeService:InitializeService,
    private router:Router
  ){}
  canActivate() {
    return this.initializeService.isInitialized().pipe(map((init:any)=>{
      if(!init.dbInitialized) return true;
        this.router.navigate(['/agent'])
        return false;
    }))
  }

}
