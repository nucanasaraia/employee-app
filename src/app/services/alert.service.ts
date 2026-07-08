import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private counter = 0;
  private alertList: Alert[] = [];
  alerts$ = new BehaviorSubject<Alert[]>([]);

  show(message: string, type: Alert['type'] = 'success') {
    const alert: Alert = { id: ++this.counter, message, type };
    this.alertList = [...this.alertList, alert];
    this.alerts$.next(this.alertList); //It tells all subscribers: "Here is the NEW alerts array."

    setTimeout(() => this.remove(alert.id), 3000);
  }

  remove(id: number) {
    this.alertList = this.alertList.filter(a => a.id !== id);
    this.alerts$.next(this.alertList);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error');   }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string)    { this.show(message, 'info');    }
}