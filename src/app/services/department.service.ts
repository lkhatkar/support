import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private url:any = `${environment.url}/api`;

  constructor(private _http: HttpClient) { }

  getDepartments(){
    return this._http.get<any>(`${this.url}/department`);
  }

  addDepartments(department:string){
    return this._http.post<any>(`${this.url}/department`, { department });
  }

  updateDepartment(id:string, department:any){
    return this._http.put<any>(`${this.url}/department/${id}`, department);
  }
}
