import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Train } from '../../../models/train.model';
import { RailwayService } from '../../../services/railway.service';
import { AlertService } from 'src/app/services/alert.service';

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
    private alert: AlertService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = +id;
      this.svc.getById(this.editingId).subscribe(data => this.form = { ...data });
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.direction)       this.errors.direction       = 'Direction is required.';
    if (!this.form.departure)       this.errors.departure       = 'Departure time is required.';
    if (!this.form.arrival)         this.errors.arrival         = 'Arrival time is required.';
    if (!this.form.travelTime) this.errors.travelTime = 'Travel time is required.';
    if (!this.form.tripNumber)    this.errors.tripNumber    = 'Trip number is required.';
    if (!this.form.tickets || this.form.tickets <= 0) this.errors.tickets = 'Tickets must be greater than 0.';
    return Object.keys(this.errors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    if (this.editingId) {
      this.svc.update(this.editingId, this.form).subscribe({
        next: () => {
          this.alert.success('Train updated successfully.');
          this.router.navigate(['/railway']);
        },
        error: () => this.alert.error('Failed to update train. Please try again.')
      });
    } else {
      this.svc.add(this.form).subscribe({
        next: () => {
          this.alert.success('Train added successfully.');
          this.router.navigate(['/railway']);
        },
        error: () => this.alert.error('Failed to add train. Please try again.')
      });
    }
  }

  cancel() { this.router.navigate(['/railway']); }
}