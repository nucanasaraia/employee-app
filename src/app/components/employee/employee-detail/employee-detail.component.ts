import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;

  constructor(
    private svc: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.svc.getById(+id).subscribe(data => {
        this.employee = data;
      });
    }
  }

  goBack()           { this.router.navigate(['/employees']); }
  goToEdit(id:number){ this.router.navigate(['/employees/edit', id]); }
}