import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Train } from 'src/app/models/train.model';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import { RailwayService } from 'src/app/services/railway.service';

@Component({
  selector: 'app-railway-list',
  templateUrl: './railway-list.component.html',
  styleUrls: ['./railway-list.component.css']
})
export class RailwayListComponent implements OnInit {
  trains: Train[] = [];
  filteredTrains: Train[] = [];
  selectedDirection: string = 'all';

  directions = [
    { value: 'all',              label: 'All Directions'     },
    { value: 'Tbilisi-Regions',  label: 'Tbilisi → Regions'  },
    { value: 'Regions-Tbilisi',  label: 'Regions → Tbilisi'  },
  ];

  constructor(
    private svc: RailwayService, 
    private router: Router,
    private alert: AlertService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe(data => {
      this.trains = data;
      this.filterByDirection();
    });
  }

  filterByDirection() {
    this.filteredTrains = this.selectedDirection === 'all'
      ? this.trains
      : this.trains.filter(t => t.direction === this.selectedDirection);
  }

  goToAdd() { 
    this.router.navigate(['/railway/add']); 
  }
  goToEdit(id: number) { 
    this.router.navigate(['/railway/edit', id]); 
  }
  
 async delete(id: number) {
  const confirmed = await this.confirmService.confirm('Delete this train schedule?');
  if (!confirmed) return;

  this.svc.delete(id).subscribe({
    next: () => {
      this.alert.success('Train schedule deleted.');
      this.load();
    },
    error: () => this.alert.error('Failed to delete train schedule.')
  });
}
}
