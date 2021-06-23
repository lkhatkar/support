import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { delay, map, retryWhen, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  connection$?: WebSocketSubject<any>;
  RETRY_SECONDS = 10;

  constructor() {
   }

  connect(): Observable<any> {
    return of('http://localhost:3000').pipe(
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http/, 'ws') + '/stream'),
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

  receive(){
    // this.connection$?.subscribe(message=>console.log('message')
    // )
  }

  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      // this.connection$ = null;
    }
  }

}
