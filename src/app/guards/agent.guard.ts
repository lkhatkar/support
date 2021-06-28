import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgentGuard implements CanActivate {
  constructor(private router: Router, private service: AuthService) { }
  canActivate() {
    if(!this.service.agentLoggedIn()){
      return true;
    }
    else {
      this.router.navigate(['/agent-login']);
      return false;
    }
  }

}
