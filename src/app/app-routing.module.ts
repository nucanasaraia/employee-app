import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee/employee-detail/employee-detail.component';
import { RailwayListComponent } from './components/railway/railway-list/railway-list.component';
import { RailwayFormComponent } from './components/railway/railway-form/railway-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login',                component: LoginComponent },
  { path: '',                     redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',            component: DashboardComponent,     canActivate: [AuthGuard] },
  { path: 'employees',            component: EmployeeListComponent,  canActivate: [AuthGuard] },
  { path: 'employees/add',        component: EmployeeFormComponent,  canActivate: [AuthGuard] },
  { path: 'employees/edit/:id',   component: EmployeeFormComponent,  canActivate: [AuthGuard] },
  { path: 'employees/detail/:id', component: EmployeeDetailComponent,canActivate: [AuthGuard] },
  { path: 'railway',              component: RailwayListComponent,   canActivate: [AuthGuard] },
  { path: 'railway/add',          component: RailwayFormComponent,   canActivate: [AuthGuard] },
  { path: 'railway/edit/:id',     component: RailwayFormComponent,   canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}