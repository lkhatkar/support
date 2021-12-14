import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _showModal$: Subject<any>;

  constructor() {
    this._showModal$ = new Subject();
  }

  openErrorModal(error: any) {
    this._showModal$.next(error);
  }

  getErrorStatus(){
    return this._showModal$.asObservable();
  }
}
