import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee/employee-detail/employee-detail.component';
import { RailwayListComponent } from './components/railway/railway-list/railway-list.component';
import { RailwayFormComponent } from './components/railway/railway-form/railway-form.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AlertComponent } from './shared/alert/alert.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    ConfirmDialogComponent,
    RailwayListComponent,
    RailwayFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule//Enables [(ngModel)] two-way binding
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
