import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url:any = "http://localhost:80/api"

  constructor(private _http: HttpClient) { }

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
    return this._http.post<any>(`${this.url}/login`,agent);
  }

  agentLoggedIn(){
    return !!localStorage.getItem('agent_token');
  }


}
