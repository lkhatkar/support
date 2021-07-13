import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url:any = `${environment.url}/api`;

  constructor(
    private _http: HttpClient,
    private router:Router
    ) { }

  getToken() {
    let payload = new HttpParams()
    .set("Client_Id",'ARI')
    .set("Client_Secret",'ARI@1777');

    return this._http.post<any>(this.url+"/token", payload)
  }
  acquireToken() {
    return sessionStorage.getItem('token');
  }
  getAgents() {
    return this._http.get<any>(this.url+"/agents");
  }
  getClients() {
    return this._http.get<any>(this.url+"/clients");
  }
  assignClient(email: string, clientId: string) {
    let payload = new HttpParams()
    .set("email", email)
    .set("id", clientId);

    return this._http.post<any>(this.url+"/handleclient", payload)

  }

  agentLogin(agent:any){
    return this._http.post<any>(`${this.url}/token`,agent);
  }

  agentLoggedIn(){
    return !!sessionStorage.getItem('token');
  }

  getCurrentAgent(){
    const currentAgent = sessionStorage.getItem('currentAgent');
    return JSON.parse(currentAgent || '{}');
  }

  agentLogout(){
    sessionStorage.removeItem('token');
    this.router.navigate(['/agent-login']);
  }

  getOnlineAgents(){
    return this._http.get<any>(this.url+"/onlineAgents");
  }

}
