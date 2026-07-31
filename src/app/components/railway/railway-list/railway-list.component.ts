import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Train } from 'src/app/models/train.model';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import { ExcelService } from 'src/app/services/excel.service';
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

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedTrains: Train[] = [];

  directions = [
    { value: 'all', label: 'RAILWAY.ALL_DIRECTIONS' },
    { value: 'Tbilisi-Regions', label: 'RAILWAY.TBILISI_REGIONS' },
    { value: 'Regions-Tbilisi', label: 'RAILWAY.REGIONS_TBILISI' },
  ];

  sortColumn: string = 'direction';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private svc: RailwayService,
    private router: Router,
    private alert: AlertService,
    private confirmService: ConfirmService,
    private excel: ExcelService,
  ) { }

  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe(data => {
      this.trains = data;
      this.filteredTrains = data;
      this.applyPagination();
    });
  }

  filterByDirection() {
    this.filteredTrains = this.selectedDirection === 'all'
      ? this.trains
      : this.trains.filter(t => t.direction === this.selectedDirection);
    this.currentPage = 1;
    this.applyPagination();
  }

  onSortChange() {
    this.filteredTrains.sort((a: any, b: any) => {
      const valA = a[this.sortColumn]?.toString().toLowerCase() ?? '';
      const valB = b[this.sortColumn]?.toString().toLowerCase() ?? '';
      return this.sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.filteredTrains.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTrains = this.filteredTrains.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPagination();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  async confirm(id: number) {
    const confirmed = await this.confirmService.confirm('Confirm this train schedule? This cannot be undone.');
    if (!confirmed) return;

    this.svc.confirm(id).subscribe({
      next: () => {
        this.alert.info('Train schedule confirmed and locked.');
        this.load();
      },
      error: () => this.alert.error('Failed to confirmation.')
    })
  }

  //excel
  exportTrains() {
    const data = this.filteredTrains.map(t => ({
      'ID': t.id,
      'Direction': t.direction,
      'Departure': t.departure,
      'Arrival': t.arrival,
      'Travel Time': t.travelTime,
      'Trip Number': t.tripNumber,
      'Tickets': t.tickets
    }));

    this.excel.exportToExcel(data, 'TrainSchedule', 'Trains');
    this.alert.success('Train schedule exported to Excel!');
  }
}
