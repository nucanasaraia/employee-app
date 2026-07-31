import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { RailwayService } from '../../services/railway.service';
import { Employee } from '../../models/employee.model';
import { Train } from '../../models/train.model';
import { EmployeeLog } from '../../models/employee-log.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalEmployees: number = 0;
  activeEmployees: number = 0;
  inactiveEmployees: number = 0;
  confirmedEmployees: number = 0;

  totalTrains: number = 0;
  confirmedTrains: number = 0;
  tbilisiToRegions: number = 0;
  regionsToTbilisi: number = 0;

  recentEmployees: Employee[] = [];
  recentTrains: Train[] = [];
  recentLogs: EmployeeLog[] = [];

  constructor(
    private empSvc: EmployeeService,
    private trainSvc: RailwayService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployeeStats();
    this.loadTrainStats();
  }

  loadEmployeeStats() {
    this.empSvc.getAllWithHistory().subscribe(data => {
      this.totalEmployees    = data.length;
      this.activeEmployees   = data.filter(e => e.isActive).length;
      this.inactiveEmployees = data.filter(e => !e.isActive).length;
      this.confirmedEmployees = data.filter(e => e.isConfirmed).length;

      this.recentEmployees = data.slice(-5).reverse();
    });
  }

  loadTrainStats() {
    this.trainSvc.getAll().subscribe(data => {
      this.totalTrains      = data.length;
      this.confirmedTrains  = data.filter(t => t.isConfirmed).length;
      this.tbilisiToRegions = data.filter(t => t.direction === 'Tbilisi-Regions').length;
      this.regionsToTbilisi = data.filter(t => t.direction === 'Regions-Tbilisi').length;

      this.recentTrains = data.slice(-5).reverse();
    });
  }

  goTo(path: string) { this.router.navigate([path]); }
}