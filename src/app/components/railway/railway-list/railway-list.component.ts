import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Train } from 'src/app/models/train.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
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
    public auth: AuthService,
    private translate: TranslateService
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
    const message = this.translate.instant('CONFIRM.DELETE_TRAIN');
    const confirmed = await this.confirmService.confirm(message);
    if (!confirmed) return;

    this.svc.delete(id).subscribe({
      next: () => {
        this.alert.error(this.translate.instant('ALERTS.TRAIN_DELETED'));
        this.load();
      },
      error: () => this.alert.error(this.translate.instant('ALERTS.FAILED_DELETE'))
    });
  }

  async confirm(id: number) {
    const message = this.translate.instant('CONFIRM.CONFIRM_TRAIN');
    const confirmed = await this.confirmService.confirm(message);
    if (!confirmed) return;

    this.svc.confirm(id).subscribe({
      next: () => {
        this.alert.info(this.translate.instant('ALERTS.TRAIN_CONFIRMED'));
        this.load();
      },
      error: () => this.alert.error(this.translate.instant('ALERTS.FAILED_CONFIRM'))
    });
  }

  exportTrains() {
    const data = this.filteredTrains.map(t => ({
      'ID': t.id,
      'Direction': t.direction,
      'Departure': t.departure,
      'Arrival': t.arrival,
      'Destination Time': t.travelTime,
      'Flight Number': t.tripNumber,
      'Tickets': t.tickets
    }));
    this.excel.exportToExcel(data, 'TrainSchedule', 'Trains');
    this.alert.success(this.translate.instant('ALERTS.TRAIN_EXPORTED'));
  }
}
