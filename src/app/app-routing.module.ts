import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee/employee-detail/employee-detail.component';
import { RailwayListComponent } from './components/railway/railway-list/railway-list.component';
import { RailwayFormComponent } from './components/railway/railway-form/railway-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees',            component: EmployeeListComponent   },
  { path: 'employees/add',        component: EmployeeFormComponent   },
  { path: 'employees/edit/:id',   component: EmployeeFormComponent   },
  { path: 'employees/detail/:id', component: EmployeeDetailComponent },
  { path: 'railway',              component: RailwayListComponent    },
  { path: 'railway/add',          component: RailwayFormComponent    },
  { path: 'railway/edit/:id',     component: RailwayFormComponent    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}