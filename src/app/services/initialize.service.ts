
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InitializeService {
  url: any = `${environment.url}/api`;
  constructor(private http: HttpClient) { }

  isInitialized() {
    return this.http.get(`${this.url}/settings`);
  }
  sendInitialData(data: any) {
    return this.http.post(`${this.url}/settings`, data);
  }
}
