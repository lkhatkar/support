import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { delay, map, retryWhen, switchMap } from 'rxjs/operators'
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  connection$?: WebSocketSubject<any>;
  RETRY_SECONDS = 10;

  constructor(private authService: AuthService) {
   }

  connect(selectedAgent: any): Observable<any> {
    // console.log('Selected agent service: ', selectedAgent);
    let url = environment.url;
    return of(`${url}?id=${selectedAgent.id}&name=${selectedAgent.name}&email=${selectedAgent.email}&dept=crane&pid=${selectedAgent.pageid}&auth=${this.authService.acquireToken()}`).pipe(
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http?/, 'ws')),
      switchMap(wsUrl => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(wsUrl);
          return this.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.RETRY_SECONDS)))
    );
  }

  send(data: any) {
    if (this.connection$) {
      this.connection$.next(data);
    } else {
      console.error('Did not send data, open a connection first');
    }
  }

  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      // this.connection$ = null;
    }
  }

}
