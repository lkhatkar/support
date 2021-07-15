import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgentMessagesService {

  private url = "http://localhost/api/initmessages";
  constructor(private http:HttpClient) { }

  getMessages(agentName:string){
    return this.http.get<any>(`${this.url}/${agentName}`);
  }

  addMessage(data:any){
    return this.http.post<any>(this.url,data);
  }

  deleteMessage(id:number){
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
