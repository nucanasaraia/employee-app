import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmRequest {
  message: string;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private requestSubject = new Subject<ConfirmRequest>();
  request$ = this.requestSubject.asObservable();

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.requestSubject.next({ message, resolve });
    });
  }
}