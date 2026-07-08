import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  editingId: number | null = null;
  form: Employee = { name: '', email: '', position: '', salary: 0 };
  errors: { name?: string; email?: string; position?: string; salary?: string } = {};

  constructor(
    private svc: EmployeeService,
    private router: Router,
    private route: ActivatedRoute, 
    private alert: AlertService 
  ) {}

  ngOnInit() {
    //check if URL has an id /employees/edit/5
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = +id; 
      this.svc.getById(this.editingId).subscribe(data => {
        this.form = { ...data };  
      });
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.name.trim())
      this.errors.name = 'Name is required.';
    if (!this.form.email.trim()) {
      this.errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errors.email = 'Enter a valid email (e.g. john@example.com).';
    }
    if (!this.form.position!.trim())
      this.errors.position = 'Position is required.';
    if (!this.form.salary || this.form.salary <= 0)
      this.errors.salary = 'Salary must be greater than 0.';
    return Object.keys(this.errors).length === 0;
  }

save() {
  if (!this.validate()) return;

  if (this.editingId) {
    this.svc.update(this.editingId, this.form).subscribe({
      next: () => {
        this.alert.success('Employee updated successfully.');
        this.router.navigate(['/employees']);
      },
      error: () => this.alert.error('Failed to update employee. Please try again.')
    });
  } else {
    this.svc.add(this.form).subscribe({
      next: () => {
        this.alert.success('Employee added successfully.');
        this.router.navigate(['/employees']);
      },
      error: () => this.alert.error('Failed to add employee. Please try again.')
    });
  }
}

  cancel() { this.router.navigate(['/employees']); }
}