import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Train } from '../../../models/train.model';
import { RailwayService } from '../../../services/railway.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-railway-form',
  templateUrl: './railway-form.component.html',
  styleUrls: ['./railway-form.component.css']
})
export class RailwayFormComponent implements OnInit {
  editingId: number | null = null;
  form: Train = { direction: '', departure: '', arrival: '', travelTime: '', tripNumber: '', tickets: 0 };
  errors: any = {};

  directions = [
    { value: 'Tbilisi-Regions', label: 'Tbilisi → Regions' },
    { value: 'Regions-Tbilisi', label: 'Regions → Tbilisi' },
  ];

  constructor(
    private svc: RailwayService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = +id;
      this.svc.getById(this.editingId).subscribe(data => this.form = { ...data });
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.direction) this.errors.direction = 'Direction is required.';
    if (!this.form.departure) this.errors.departure = 'Departure time is required.';
    if (!this.form.arrival) this.errors.arrival = 'Arrival time is required.';
    if (!this.form.travelTime) this.errors.travelTime = 'Travel time is required.';
    if (!this.form.tripNumber) this.errors.tripNumber = 'Trip number is required.';
    if (!this.form.tickets || this.form.tickets <= 0) this.errors.tickets = 'Tickets must be greater than 0.';
    return Object.keys(this.errors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    if (this.editingId) {
      this.svc.update(this.editingId, this.form).subscribe(() => {
        this.alert.success(this.translate.instant('ALERTS.TRAIN_UPDATED'));
        this.router.navigate(['/railway']);
      });
    } else {
      this.svc.add(this.form).subscribe(() => {
        this.alert.success(this.translate.instant('ALERTS.TRAIN_ADDED'));
        this.router.navigate(['/railway']);
      });
    }
  }

  cancel() { this.router.navigate(['/railway']); }
}