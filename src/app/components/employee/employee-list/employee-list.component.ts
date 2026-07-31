import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeLog } from 'src/app/models/employee-log.model';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  historyEmployees: Employee[] = [];
  searchTerm: string = '';

  showHistory: boolean = false;
  logs: EmployeeLog[] = [];
  showLogs: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedEmployees: Employee[] = [];

  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private svc: EmployeeService,
    private router: Router,
    private alert: AlertService,
    private confirmService: ConfirmService,
    private excel: ExcelService
  ) { }
  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data;
      this.applyPagination();
    });
  }

  search() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredEmployees = !term ? this.employees
      : this.employees.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.position!.toLowerCase().includes(term)
      );
    this.currentPage = 1;
    this.applyPagination();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredEmployees = this.employees;
    this.currentPage = 1;
    this.applyPagination();
  }


  onSortChange() {
    this.filteredEmployees.sort((a: any, b: any) => {
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
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEmployees = this.filteredEmployees.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPagination();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.svc.getAllWithHistory().subscribe(data => {
        this.historyEmployees = data;
      });
    }
  }

  goToAdd() { this.router.navigate(['/employees/add']); }
  goToEdit(id: number) { this.router.navigate(['/employees/edit', id]); }
  goToDetail(id: number) { this.router.navigate(['/employees/detail', id]); }

  async delete(id: number) {
    const confirmed = await this.confirmService.confirm('Delete this employee?');
    if (!confirmed) return;

    this.svc.delete(id).subscribe({
      next: () => {
        this.alert.success('Employee deleted.');
        this.load();
      },
      error: () => this.alert.error('Failed to delete employee.')
    });
  }

  async confirm(id: number) {
    const confirmed = await this.confirmService.confirm('Are you sure you want to confirm this employee? This cannot be undone.');
    if (!confirmed) return;

    this.svc.confirm(id).subscribe({
      next: () => {
        this.alert.info('Employee confirmed. Row is now locked.');
        this.load();
      },
      error: () => this.alert.error('Failed to confirmation.')
    })
  }

  //excel
  exportEmployees() {
    const data = this.filteredEmployees.map(e => ({
      'ID': e.id,
      'Name': e.name,
      'Email': e.email,
      'Position': e.position,
      'Salary': e.salary,
      'Status': e.isActive ? 'Active' : 'Inactive'
    }));

    this.excel.exportToExcel(data, 'Employees', 'Employees');
    this.alert.success('Employees exported to Excel!');
  }

  exportHistory() {
    const data = this.historyEmployees.map(e => ({
      'ID': e.id,
      'Name': e.name,
      'Email': e.email,
      'Position': e.position,
      'Salary': e.salary,
      'Status': e.isActive ? 'Active' : 'Inactive'
    }));

    this.excel.exportToExcel(data, 'Employees_History', 'History');
    this.alert.success('History exported to Excel!');
  }



  toggleLogs() {
    this.showLogs = !this.showLogs;
    if (this.showLogs) {
      this.svc.getAllLogs().subscribe(data => {
        this.logs = data;
      });
    }
  }

  getActionColor(action: string): string {
    switch (action) {
      case 'ADD': return '#4CAF50';
      case 'UPDATE': return '#FF9800';
      case 'DEACTIVATE': return '#f44336';
      case 'VIEW': return '#2196F3';
      default: return '#999';
    }
  }
}