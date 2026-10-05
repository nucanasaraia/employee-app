import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { RailwayService } from '../../services/railway.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { Train } from '../../models/train.model';
import { EmployeeLog } from '../../models/employee-log.model';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ── Employee stats ─────────────────────────────────────────
  totalEmployees: number = 0;
  activeEmployees: number = 0;
  inactiveEmployees: number = 0;
  confirmedEmployees: number = 0;

  // ── Train stats ────────────────────────────────────────────
  totalTrains: number = 0;
  confirmedTrains: number = 0;
  tbilisiToRegions: number = 0;
  regionsToTbilisi: number = 0;

  // ── Recent data ────────────────────────────────────────────
  recentEmployees: Employee[] = [];
  recentTrains: Train[] = [];
  recentLogs: EmployeeLog[] = [];

  // ── Role management ────────────────────────────────────────
  roles: RoleModel[] = [];
  newRoleName: string = '';
  roleError: string = '';

  constructor(
    private empSvc: EmployeeService,
    private trainSvc: RailwayService,
    private router: Router,
    public auth: AuthService          // ← public so HTML can access it
  ) { }

  ngOnInit() {
    this.loadEmployeeStats();
    this.loadTrainStats();
    if (this.auth.isAdmin()) this.loadRoles();  // ← only load for admin
  }

  // ── Employee stats ─────────────────────────────────────────
  loadEmployeeStats() {
    this.empSvc.getAllWithHistory().subscribe(data => {
      this.totalEmployees = data.length;
      this.activeEmployees = data.filter(e => e.isActive).length;
      this.inactiveEmployees = data.filter(e => !e.isActive).length;
      this.confirmedEmployees = data.filter(e => e.isConfirmed).length;
      this.recentEmployees = data.slice(-5).reverse();
    });
  }

  // ── Train stats ────────────────────────────────────────────
  loadTrainStats() {
    this.trainSvc.getAll().subscribe(data => {
      this.totalTrains = data.length;
      this.confirmedTrains = data.filter(t => t.isConfirmed).length;
      this.tbilisiToRegions = data.filter(t => t.direction === 'Tbilisi-Regions').length;
      this.regionsToTbilisi = data.filter(t => t.direction === 'Regions-Tbilisi').length;
      this.recentTrains = data.slice(-5).reverse();
    });
  }

  // ── Role management ────────────────────────────────────────
  loadRoles() {
    this.auth.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  addRoles() {
    this.roleError = '';
    if (!this.newRoleName.trim()) {
      this.roleError = 'Role name cannot be empty.';
      return;
    }

    const newRole = { name: this.newRoleName.trim() } as RoleModel;

    this.auth.addRoles(newRole).subscribe({
      next: () => {
        this.newRoleName = '';
        this.loadRoles();
      },
      error: (err) => {
        this.roleError = err.error?.message ?? 'Failed to add role.';
      }
    });
  }

  deleteRole(roleId: number) {
    this.auth.deleteRole(roleId).subscribe({
      next: () => {
        this.loadRoles();
        this.roleError = '';
      },
      error: (err) => {
        this.roleError = err.error?.message ?? 'Cannot delete — role may be assigned to users.';
      }
    });
  }

  goTo(path: string) { this.router.navigate([path]); }
}