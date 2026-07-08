import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { EmployeeLog } from '../models/employee-log.model';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<Employee> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/employees`); 
  }

  getAllWithHistory(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/with-history`);
  }

  getAllLogs(): Observable<EmployeeLog[]> {
    return this.http.get<EmployeeLog[]>(`${environment.apiUrl}/log`);
  }

  getLogsByEmployee(id: number): Observable<EmployeeLog[]> {
    return this.http.get<EmployeeLog[]>(`${environment.apiUrl}/log/employee/${id}`);
  }
}