import { Component, OnInit } from '@angular/core';
import { Alert, AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  close(id: number) {
    this.alertService.remove(id);
  }
}